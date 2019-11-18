'use strict';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { MPgetPlayerPositions, getRandomKey, getKey } from './utilities';
import { MPStatus, MPGameStatus, TournamentKeys, UncompletedGameScore } from './constants';
import { debug } from 'util';

const db = admin.database();
const playersInGame = 2;

// // hold your horsies
// const wait = (time) => new Promise((resolve) => {
//     setTimeout(resolve, time);
// });

const MPcloseOld = function (response: functions.Response) {
    const fancyTime = new Date();
    const closeGameTime = fancyTime.setMinutes(fancyTime.getMinutes() - 15);
    const cutOffTime = fancyTime.setMinutes(fancyTime.getMinutes() - 30);
    const query = db.ref().child('mpg/');
    // const idquery = db.ref().child('mpg/id/');

    console.log('fetching old games to close');
    console.log(fancyTime);
    console.log(fancyTime.toString());

    return query.child('id').limitToLast(100).once("value", function (snapshot: any) {
      //return query.orderByKey().startAt(closeGameTime.toString()).endAt(cutOffTime.toString()).once("value", function (snapshot: any) {
        if (snapshot.val() !== null) {
            console.log('got ids'); 
             const updates = {};
            snapshot.forEach(id => {
                if (id.key < closeGameTime) {
                    if (id.val() && id.val() !== MPGameStatus[MPGameStatus.c]) {                 
                        // updates[id.val().startTime] = id.val();
                        updates['/g/' + id.key + '/s/'] = MPGameStatus[MPGameStatus.c];
                        updates['/id/' + id.key] = MPGameStatus[MPGameStatus.c];
                        console.log(id.key + ' has been closed');   
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

const MPdeleteOld = function (response: functions.Response) {
    const fancyTime = new Date();  
    const deleteGameTime = fancyTime.setHours(fancyTime.getHours() - 24);
    const query = db.ref().child('mpg/');  

    console.log('fetching old games to remove' + deleteGameTime);

    //return query.orderByKey().limitToFirst(10000).once("value", function (snapshot: any) {
    return query.child('id').orderByKey().endAt(deleteGameTime.toString()).once("value", function (snapshot: any) {
        
        if (snapshot.val() !== null) {
            console.log('got ids');
            const updates = {};
            snapshot.forEach(id => {
                 if (id.key < deleteGameTime) {
                    updates['/g/' + id.key] = null;
                    updates['/id/' + id.key] = null;
                    console.log(id.key + ' has been deleted');
                 }
             });
             
           return query.update(updates);     
        }
        return 0;
    }).then(() => {
        console.log('all done: cleanupMultiplayerGames');
        response.send('all done: cleanupMultiplayerGames');
    }).catch(error => console.error(error));
    // return response.send('completed multiplayer games cleanup');
};

// const closeBrokenGames = function (response: functions.Response) {
//     console.log('started closeBrokenGames');

//     const fancyTime = new Date();
//     const cuts = fancyTime.setHours(fancyTime.getHours() - 1);
//     const query = db.ref().child('multiplayerOngoing/games/').orderByChild('startTime').endAt(cuts);

//     console.log('fetching games that are older than one hour');
//     return query.once("value", function (snapshot: any) {
//         if (snapshot.val() !== null) {
//             console.log('got old games');

//             snapshot.forEach(game => {
//                 console.log(game.val());
//                 if (game.val().status === GameStatus[GameStatus.ongoing]) {
//                     console.log('game to resolve');
//                     console.log(game.val().gameID);
//                     game.child("status").getRef().set = GameStatus[GameStatus.completed];
//                 }
//             });
//         }
//         else {
//             console.error('failed to get old games');
//         }
//     }).then(() => {
//         console.log('closed broken games');
//         response.send('completed multiplayer games cleanup');
//     }).catch(error => console.error(error));

//     // return response.send('completed multiplayer games cleanup');
// };

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
            players[participant].playerID = participant;
            scoreCards.push(players[participant]);
        });

        // reset the scores for players that did not complete their round during the game
        const resetScores = scoreCards.map(scoreCard => {

            const scoresUncompleted = !scoreCard.s || scoreCard.s.some(score => score === 0);
            if (scoresUncompleted || scoreCard.ms !== MPStatus[MPStatus.rc]) {
                scoreCard.t = UncompletedGameScore;
            }
            return scoreCard;
        });

        const positions = MPgetPlayerPositions(resetScores);

        // reset positions for players that did not complete their round during the game
        const resetPositions = positions.map(scoreCard => {
            scoreCard.position = scoreCard.t === UncompletedGameScore ? scoreCards.length : scoreCard.position;
            return scoreCard;
        });

        //const everyoneTimedOut = resetPositions.every(scoreCard => {
        //   return scoreCard.score === UncompletedGameScore;
        //});

        //const ratings = getPlayerRatings(resetPositions, everyoneTimedOut);

        resetPositions.forEach(function (scoreCard) {
            // do not update game stats for players that retired
            if (scoreCard.ms !== MPStatus[MPStatus.r]) {
                db.ref().child('playerData/' + scoreCard.playerID + '/openGames/' + gameID).update({
                    status: MPGameStatus[MPGameStatus.c],
                    position: scoreCard.position,
                    ratingChange: 1,
                    completedGame: scoreCard.t < UncompletedGameScore
                });
            }
        });

        resolve(); // all done
    }); // promise ends
};

const MPonGameStatusUpdated = function (change, context) {
    const gameID = context.params.pushId;
    console.log('game status updated:');
    console.log(change.after.val());

    return new Promise((resolve, reject) => {

        if (change.after.val() === MPGameStatus[MPGameStatus.c]) {
            const query = change.after.ref.parent.child('sc');
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

const MPonStatusUpdated = function (change, context) {
    const gameID = context.params.pushId;

    // 1. check status on game so it is not already completed
    // 2. if not completed check if all player are ready or time has expired
    // 3. set status to completed
    // 4. calculate position
    // 5. calculate rating

    const query = db.ref().child('mpg/g/' + gameID);
    query.transaction(function (game: any) {

        if (game && game.s && game.s !== MPGameStatus[MPGameStatus.c]) {
            const scoreCards = [];

            Object.keys(game.sc).forEach(function (participant) {
                scoreCards.push(game.sc[participant]);
            });

            const stillPlaying = scoreCards.some(item => {
                return item.ms !== MPStatus[MPStatus.rc] && item.ms !== MPStatus[MPStatus.r];
            });

            if (!stillPlaying) {
                console.log('set game status to completed for game: ' + gameID);
                game.s = MPGameStatus[MPGameStatus.c];
                db.ref().child('mpg/id/' + gameID).set(MPGameStatus[MPGameStatus.c]);
            }
        }

        return game;
    });

    return change;
};

const MPonGameAdded = function (snapshot, context) {

    console.log('got game - on game added');
    const gameID = context.params.pushId;
    console.log(gameID);
    console.log(snapshot);

    const game2 = snapshot.val();
    const participants = Object.keys(game2['sc']);
    //const fancyTime = game2['st']

    return new Promise((resolve) => {
        db.ref().child('mpg/g/' + gameID).set(game2);
        db.ref().child('mpg/id/' + gameID).set(game2.s);

        snapshot.ref.remove();

        participants.forEach(id => {
            db.ref().child('playerData/' + id + '/multiplayerGame').set(gameID);
            db.ref().child('playerData/' + id + '/openGames/' + gameID).set({
                //gameID: gameID,
                status: MPGameStatus[MPGameStatus.o],
               // startTime: fancyTime,
            });

        });
        resolve();
    });
};

const MPonPlayerAddedExistingGame = function (snapshot, context) {
    return new Promise((resolve) => {

        db.ref().child('mp/currentGame/gameID').once('value', function (gameID) {
            if (gameID.val() !== null) {

                db.ref().child('mpg/g/' + gameID.val() + '/sc/' + snapshot.key).set(snapshot.val());

                db.ref().child('playerData/' + snapshot.key + '/multiplayerGame').set(gameID.val());
                db.ref().child('playerData/' + snapshot.key + '/openGames/' + gameID.val()).set({
                   // gameID: gameID.val(),
                    status: MPGameStatus[MPGameStatus.o],
                   // startTime: gameID.val(),
                });
                snapshot.ref.remove();
                resolve();
            }
        }).catch(error => console.error(error));

    });
};


const MPonPlayerAdded = function (snapshot, context) {
    const ref = db.ref().child('mp/');
    ref.transaction(function (transaction: any) {
        console.log('onPlayerAdded starts');

        if (transaction && transaction.pq) {
            // console.log('transaction');
            //console.log(transaction);

            const playerQueueNode = 'pq';
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
                    transaction.pq[pants] = null;
                });
                const tournamentKey = getRandomKey(TournamentKeys);
                console.log('got random tournament key');

                const fancyTime = new Date().getTime();

                transaction.freshGames = transaction.freshGames || {};
                transaction.freshGames[fancyTime] = {
                    sc: partyPants,
                    st: fancyTime,
                    t: tournamentKey,
                    s: MPGameStatus[MPGameStatus.o],
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
                console.log(transaction.pq[snapshot.key].multiplayerStatus);
                console.log('ongoing game key: ');
                console.log(transaction.currentGame.gameID);

                //check if we have an ongoing game with free space. Also check if it's the same game the player just completed
                if (transaction.currentGame && transaction.currentGame.playerCount < 4 && transaction.currentGame.gameID != transaction.pq[snapshot.key].multiplayerStatus) {
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

                        transaction.pq[snapshot.key] = null;
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
const MPonPlayerRemoved = function (snapshot, context) {
    console.log('removed user function started');
    console.log(snapshot.val());

    const ref = db.ref().child('mp/');
    ref.transaction(function (transaction: any) {

        if (transaction && transaction.PlayerQueue) {
            const players = Object.keys(transaction.PlayerQueue).length;
            transaction.playersInQueue = players;
        }

        return transaction;
    });
}

export {
    MPonPlayerAdded,
    MPonPlayerAddedExistingGame,
    MPonPlayerRemoved,
    MPonGameAdded,
    MPonStatusUpdated,
    MPonGameStatusUpdated,
    MPcloseOld,
    MPdeleteOld  
};