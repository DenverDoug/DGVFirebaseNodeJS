'use strict';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getPlayerPositions, getRandomKey } from './utilities';
import { MultiplayerStatus, GameStatus, TournamentKeys, UncompletedGameScore } from './constants';

const db = admin.database();
const playersInGame = 4;

const cleanupMultiplayerGames = function (response: functions.Response) {
    const fancyTime = new Date();
    const cuts = fancyTime.setHours(fancyTime.getHours() - 24);
    const query = db.ref().child('multiplayerOngoing/games/').orderByChild('startTime').endAt(cuts);

    console.log('fetching old games to remove');
    query.once("value", function (snapshot: any) {
        if (snapshot.val() !== null) {
            console.log('got old games to remove');
            console.log(snapshot.val());

            snapshot.forEach(game => {
                game.ref.remove();
            });
        }
        else {
            console.error('failed to get old games');
        }
    });

    return response.send('completed multiplayer games cleanup');
};

const closeBrokenGames = function (response: functions.Response) {
    console.log('started closeBrokenGames');

    const fancyTime = new Date();
    const cuts = fancyTime.setHours(fancyTime.getHours() - 1);
    const query = db.ref().child('multiplayerOngoing/games/').orderByChild('startTime').endAt(cuts);

    console.log('fetching games that are older than one hour');
    return query.once("value", function (snapshot: any) {
        if (snapshot.val() !== null) {
            console.log('got old games');

            snapshot.forEach(game => {
                console.log(game.val());
                if (game.val().status === GameStatus[GameStatus.ongoing]) {
                    console.log('game to resolve');
                    console.log(game.val().gameID);
                    game.child("status").getRef().set = GameStatus[GameStatus.completed];
                }
            });
        }
        else {
            console.error('failed to get old games');
        }
    }).then(() => {
        console.log('closed broken games');
        response.send('completed multiplayer games cleanup');
    }).catch(error => console.error(error));;

    // return response.send('completed multiplayer games cleanup');
};

const getPlayerRatings = function (scoreCards: Array<any>, everyoneTimedOut: boolean) {
    
    // const positionModifyers4 = [0.75, 0.5, 0, -0.25];
    // const positionModifyers3 = [0, 0.33, 0.66];
    // const positionModifyers2 = [0.25, 0.75];

    const positionModifyers = {
        4 : [0.75, 0.5, 0, -0.25] ,
        3 : [0, 0.33, 0.66],
        2 : [0.25, 0.75]
    };

    const ratingsBase = 20;

    const ratings = scoreCards.map(item => { return item.rating });
    const ratingsSum = ratings.reduce((a, b) => a + b, 0);
           
    const playerCount = scoreCards.length;

    const scoreCardRatings = scoreCards.map(player => {
        if (everyoneTimedOut) {
            player.ratingChange = 0;
        }
        else {

            const power = player.rating / ratingsSum;
            const positionModifyer = positionModifyers[playerCount][player.position - 1];
            const diff = positionModifyer - power;
            player.ratingChange = ratingsBase * diff;
        }

        return player;
    });

    return scoreCardRatings;
}

const closeCompletedGame = function (results: any, gameID: string) {
    return new Promise((resolve, reject) => {
        console.log('close completed game, calculate positions and ratings and good bois');

        const players = results.val();

        const scoreCards = [];
        Object.keys(players).forEach(function (participant) {
            scoreCards.push(players[participant]);
        });

        // reset the scores for players that did not complete their round during the game
        const resetScores = scoreCards.map(scoreCard => {

            const scoresUncompleted = !scoreCard.scores || scoreCard.scores.some(score => score === 0);
            if (scoresUncompleted || scoreCard.multiplayerStatus !== MultiplayerStatus[MultiplayerStatus.roundComplete]) {
                scoreCard.score = UncompletedGameScore;
            }
            return scoreCard;
        });

        const positions = getPlayerPositions(resetScores);

        // reset positions for players that did not complete their round during the game
        const resetPositions = positions.map(scoreCard => {
            scoreCard.position = scoreCard.score === UncompletedGameScore ? scoreCards.length : scoreCard.position;
            return scoreCard;
        });

        const everyoneTimedOut = resetPositions.every(scoreCard => {
            return scoreCard.score === UncompletedGameScore;
        });

        const ratings = getPlayerRatings(resetPositions, everyoneTimedOut);

        ratings.forEach(function (scoreCard) {
            // do not update game stats for players that retired
            if (scoreCard.multiplayerStatus !== MultiplayerStatus[MultiplayerStatus.retired]) {
                db.ref().child('playerData/' + scoreCard.playerID + '/openGames/' + gameID).update({
                    status: GameStatus[GameStatus.completed],
                    position: scoreCard.position,
                    ratingChange: scoreCard.ratingChange,
                    completedGame: scoreCard.score < UncompletedGameScore
                });
            }
        });

        resolve(); // all done
    }); // promise ends
};

const onMultiPlayerGameStatusUpdated = function (change, context) {
    const gameID = context.params.pushId;
    console.log('game status updated:');
    console.log(change.after.val());

    return new Promise ((resolve, reject) => {

        if (change.after.val() === GameStatus[GameStatus.completed]) {
            const query = change.after.ref.parent.child('scoreCards');
            query.once("value", function (snapshot) {
                if (snapshot.val() !== null) {
                    closeCompletedGame(snapshot, gameID).then(() => {
                        resolve();
                    }).catch(error => console.error(error));
                }
                else {
                    const message = 'failed to get scoreCards for game:' + gameID;
                    reject(message);
                }
            });
        }
        else {
            resolve();
        }

    });

};

const onMultiPlayerStatusUpdated = function (change, context) {
    const gameID = context.params.pushId;

    // 1. check status on game so it is not already completed
    // 2. if not completed check if all player are ready or time has expired
    // 3. set status to completed
    // 4. calculate position
    // 5. calculate rating

    const query = db.ref().child('multiplayerOngoing/games/' + gameID);
    query.transaction(function (game: any) {

        if (game && game.status && game.status !== GameStatus[GameStatus.completed]) {
            const scoreCards = [];

            Object.keys(game.scoreCards).forEach(function (participant) {
                scoreCards.push(game.scoreCards[participant]);
            });

            const stillPlaying = scoreCards.some(item => {
                return item.multiplayerStatus !== MultiplayerStatus[MultiplayerStatus.roundComplete] && item.multiplayerStatus !== MultiplayerStatus[MultiplayerStatus.retired];
            });

            if (!stillPlaying) {
                console.log('set game status to completed for game: ' + gameID);
                game.status = GameStatus[GameStatus.completed];
            }
        }

        return game;
    });

    return change;
};

const onGameAdded = function (snapshot, context) {
    
    console.log('got game - on game added');
    const gameID = context.params.pushId;
    console.log(gameID);
    console.log(snapshot);

    const game2 = snapshot.val();
    const participants = Object.keys(game2['scoreCards']);
    const fancyTime = game2['startTime']

    db.ref().child('multiplayerOngoing/games/' + gameID).set(game2);

    snapshot.ref.remove();

    participants.forEach(id => {
        db.ref().child('playerData/' + id + '/multiplayerGame').set(gameID);
        db.ref().child('playerData/' + id + '/openGames/' + gameID).set({
            gameID: gameID,
            status: GameStatus[GameStatus.ongoing],
            startTime: fancyTime,
        });
    });

    console.log('starting multiplayer game countdown');
    setTimeout(function () {

        console.log('game expired, set game status to completed for game: ' + gameID);

        const query = db.ref().child('/multiplayerOngoing/games/' + gameID);
        query.transaction(function (game: any) {
            if (game && game.status && game.status !== GameStatus[GameStatus.completed]) {
                game.status = GameStatus[GameStatus.completed];
            }
            return game;
        });
    }, 900000);

    return snapshot;
};

const onPlayerAdded = function (snapshot, context) {
    const ref = db.ref().child('multiplayer/');
    ref.transaction(function (transaction: any) {
        console.log('inside cannon: playerQueue');

        if (transaction && transaction.PlayerQueue) {
            console.log('transaction');
            console.log(transaction);

            const playerQueueNode = 'PlayerQueue';
            const players = transaction[playerQueueNode];
            console.log('players');
            console.log(players);

            const keys = Object.keys(players);
            console.log('user count in player queue: ' + keys.length);

            if (keys.length >= playersInGame) {

                const participants = keys.slice(0, playersInGame);
                const partyPants = {};

                participants.forEach(pants => {
                    partyPants[pants] = players[pants];
                    transaction.PlayerQueue[pants] = null;
                });
                const tournamentKey = getRandomKey(TournamentKeys);
                console.log('got random tournament key');

                const fancyTime = new Date().getTime();

                transaction.freshGames = transaction.freshGames || {};
                transaction.freshGames[fancyTime] = {
                    scoreCards: partyPants,
                    startTime: fancyTime,
                    tournament: tournamentKey,
                    status: GameStatus[GameStatus.ongoing],
                }
                transaction.currentGame = transaction.currentGame || {};
                transaction.currentGame.players =  keys.length;
                transaction.currentGame.gameID =  fancyTime;
                
                transaction.playersInQueue = keys.length - participants.length;
            }
            else {
                if(transaction.currentGame && transaction.currentGame.players < 4){

                    
                    transaction.currentGame.playersToAdd[snapshot.val().playerID] = snapshot.val();

                }
                transaction.playersInQueue = keys.length;
            }
        }

        return transaction;
    });
}
const onPlayerRemoved = function (snapshot, context) {
    console.log('removed user function started');
    console.log(snapshot.val());

    const ref = db.ref().child('multiplayer/');
    ref.transaction(function (transaction: any) {

        if (transaction && transaction.PlayerQueue) {
            const players = Object.keys(transaction.PlayerQueue).length;
            transaction.playersInQueue = players;
        }

        return transaction;
    });
}

export {
    onPlayerAdded,
    onPlayerRemoved,
    onGameAdded,
    onMultiPlayerStatusUpdated,
    onMultiPlayerGameStatusUpdated,
    cleanupMultiplayerGames,
    closeBrokenGames
};