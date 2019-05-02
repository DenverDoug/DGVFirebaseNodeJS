'use strict';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getPlayerPositions, getRandomKey, getKey } from './utilities';
import { MultiplayerStatus, GameStatus, TournamentKeys, UncompletedGameScore } from './constants';

const db = admin.database();
const playersInGame = 2;

// // hold your horsies
// const wait = (time) => new Promise((resolve) => {
//     setTimeout(resolve, time);
// });

const cleanupMultiplayerGames = function (response: functions.Response) {
    const fancyTime = new Date();
    const closeGameTime = fancyTime.setMinutes(fancyTime.getMinutes() - 15);
    const deleteGameTime = fancyTime.setHours(fancyTime.getHours() - 48);
    const query = db.ref().child('multiplayerOngoing/games/');

    console.log('fetching old games to remove nein');

    console.log(closeGameTime);
    console.log(deleteGameTime);

    return query.once("value", function (snapshot: any) {
        if (snapshot.val() !== null) {
            console.log('got games');
            const updates = {};

            snapshot.forEach(game => {
                if (game.val().startTime < deleteGameTime) {
                    updates[game.val().startTime] = null;
                }
                else if (game.val().startTime < closeGameTime) {
                    if (game.val().status && game.val().status !== GameStatus[GameStatus.completed]) {
                        //  game.child("status").getRef().set = GameStatus[GameStatus.completed];
                        updates[game.val().startTime] = game.val();
                        updates[game.val().startTime].status = GameStatus[GameStatus.completed];

                        console.log(game.val().startTime + ' has been closed');
                    }
                }
            });
            // console.log(updates);
            return query.update(updates)
        }
        return 0;
    }).then(() => {
        console.log('all done: cleanupMultiplayerGames');
        response.send('all done: cleanupMultiplayerGames');
    }).catch(error => console.error(error));


    // return response.send('completed multiplayer games cleanup');
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
    }).catch(error => console.error(error));

    // return response.send('completed multiplayer games cleanup');
};

const getPlayerRatings = function (scoreCards: Array<any>, everyoneTimedOut: boolean) {

    const positionModifyers = {
        4: [0.75, 0.5, 0, -0.25],
        3: [0.66, 0.33, 0],
        2: [0.75, 0.25]
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

    return new Promise((resolve, reject) => {

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

    return new Promise((resolve) => {
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
        resolve();
    });

    // console.log('starting multiplayer game countdown');
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         console.log(gameID + ' has reached timeout');
    //         const query = db.ref().child('/multiplayerOngoing/games/' + gameID);
    //         query.transaction(function (game: any) {
    //             if (game && game.status && game.status !== GameStatus[GameStatus.completed]) {
    //                 game.status = GameStatus[GameStatus.completed];
    //                 console.log(gameID + ' has been closed');
    //             }
    //             else{
    //                 console.log(gameID + ' was already closed');
    //             }
    //             return game;
    //         }).then(() => {
    //             resolve();
    //         }).catch(error => console.error(error));
    //     }, 900000);
    // });
};

const onPlayerAddedExistingGame = function (snapshot, context) {
    return new Promise((resolve) => {

        db.ref().child('multiplayer/currentGame/gameID').once('value', function (gameID) {
            if (gameID.val() !== null) {

                db.ref().child('multiplayerOngoing/games/' + gameID.val() + '/scoreCards/' + snapshot.key).set(snapshot.val());

                db.ref().child('playerData/' + snapshot.key + '/multiplayerGame').set(gameID.val());
                db.ref().child('playerData/' + snapshot.key + '/openGames/' + gameID.val()).set({
                    gameID: gameID.val(),
                    status: GameStatus[GameStatus.ongoing],
                    startTime: gameID.val(),
                });
                snapshot.ref.remove();
                resolve();
            }
        }).catch(error => console.error(error));

    });
};


const onPlayerAdded = function (snapshot, context) {

    const ref = db.ref().child('multiplayer/');
    ref.transaction(function (transaction: any) {
        console.log('onPlayerAdded starts');

        if (transaction && transaction.PlayerQueue) {
            // console.log('transaction');
            //console.log(transaction);

            const playerQueueNode = 'PlayerQueue';
            const players = transaction[playerQueueNode];
            //console.log('players');
            //console.log(players);

            const keys = Object.keys(players);
            console.log('user count in player queue: ' + keys.length);

            //Check if we have enough players to start a game
            if (keys.length >= playersInGame) {
                //start game
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
                //record that we have an open game with free space
                transaction.currentGame = transaction.currentGame || {};
                transaction.currentGame.playerCount = participants.length;
                transaction.currentGame.gameID = fancyTime;

                transaction.playersInQueue = keys.length - participants.length;
            }
            else {
                //console.log(transaction.currentGame.playerCount);
                // const ID = getKey(snapshot.val(), true);
                console.log(snapshot.key);
                console.log('previous game key: ');
                console.log(transaction.PlayerQueue[snapshot.key].multiplayerStatus);
                console.log('ongoing game key: ');
                console.log(transaction.currentGame.gameID);

                //check if we have an ongoing game with free space. Also check if it's the same game the player just completed
                if (transaction.currentGame && transaction.currentGame.playerCount < 4 && transaction.currentGame.gameID != transaction.PlayerQueue[snapshot.key].multiplayerStatus) {
                    // sexy dates
                    console.log("current game exists");

                    const now = new Date().getTime();
                    const cutOff = transaction.currentGame.gameID + (60000 * 5);
                    //console.log(now);
                    //console.log(cutOff);
                    if (now < cutOff) {
                        console.log("current game exists and within five minutes");
                        //  console.log(snapshot.val());
                        // console.log(snapshot.key);

                        transaction.currentGame.playersToAdd = transaction.currentGame.playersToAdd || {};
                        transaction.currentGame.playersToAdd[snapshot.key] = snapshot.val();
                        transaction.currentGame.playerCount++;

                        transaction.PlayerQueue[snapshot.key] = null;
                    }
                }
                // butt
                transaction.playersInQueue = keys.length;
            }
        }
        // buttbuttination => butt swipe => minus 1000 buttpoints
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
    onPlayerAddedExistingGame,
    onPlayerRemoved,
    onGameAdded,
    onMultiPlayerStatusUpdated,
    onMultiPlayerGameStatusUpdated,
    cleanupMultiplayerGames,
    closeBrokenGames
};