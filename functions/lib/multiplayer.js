'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const utilities_1 = require("./utilities");
const constants_1 = require("./constants");
const db = admin.database();
const playersInGame = 4;
const cleanupMultiplayerGames = function (response) {
    const fancyTime = new Date();
    const cuts = fancyTime.setHours(fancyTime.getHours() - 24);
    const query = db.ref().child('/multiplayer/games/').orderByChild('startTime').endAt(cuts);
    console.log('fetching old games to remove');
    query.once("value", function (snapshot) {
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
exports.cleanupMultiplayerGames = cleanupMultiplayerGames;
const getPlayerRatings = function (scoreCards, everyoneTimedOut) {
    const positionModifyers = [0.75, 0.5, 0, -0.25];
    const ratingsBase = 20;
    const ratings = scoreCards.map(item => { return item.rating; });
    const ratingsSum = ratings.reduce((a, b) => a + b, 0);
    const scoreCardRatings = scoreCards.map(player => {
        if (everyoneTimedOut) {
            player.ratingChange = 0;
        }
        else {
            const power = player.rating / ratingsSum;
            const positionModifyer = positionModifyers[player.position - 1];
            const diff = positionModifyer - power;
            player.ratingChange = ratingsBase * diff;
        }
        return player;
    });
    return scoreCardRatings;
};
// const getRandomTournament = function () {
//     return new Promise((resolve, reject) => {
//         // console.log('get random tournament');
//         // const query = db.ref().child('tournaments/');
//         // getData(query, function (tournaments: any) {
//         //     console.log('tournament keys loaded');
//         //     const keys = Object.keys(tournaments.val());
//         //     const randomKey = getRandomKey(keys);
//         //     console.log('got random tournament key');
//         //     console.log(randomKey);
//         //     resolve(randomKey);
//         // }, function () {
//         //     console.error('got no tournaments');
//         //     reject();
//         // });
//     });
// };
const closeCompletedGame = function (results, gameID) {
    console.log('close completed game, calculate positions and ratings and good bois');
    const players = results.val();
    const scoreCards = [];
    Object.keys(players).forEach(function (participant) {
        scoreCards.push(players[participant]);
    });
    // reset the scores for players that did not complete their round during the game
    const resetScores = scoreCards.map(scoreCard => {
        const scoresUncompleted = !scoreCard.scores || scoreCard.scores.some(score => score === 0);
        if (scoresUncompleted || scoreCard.multiplayerStatus !== constants_1.MultiplayerStatus[constants_1.MultiplayerStatus.roundComplete]) {
            scoreCard.score = constants_1.UncompletedGameScore;
        }
        return scoreCard;
    });
    const positions = utilities_1.getPlayerPositions(resetScores);
    // reset positions for players that did not complete their round during the game
    const resetPositions = positions.map(scoreCard => {
        scoreCard.position = scoreCard.score === constants_1.UncompletedGameScore ? playersInGame : scoreCard.position;
        return scoreCard;
    });
    const everyoneTimedOut = resetPositions.every(scoreCard => {
        return scoreCard.score === constants_1.UncompletedGameScore;
    });
    const ratings = getPlayerRatings(resetPositions, everyoneTimedOut);
    ratings.forEach(function (scoreCard) {
        // do not update game stats for players that retired
        if (scoreCard.multiplayerStatus !== constants_1.MultiplayerStatus[constants_1.MultiplayerStatus.retired]) {
            db.ref().child('playerData/' + scoreCard.playerID + '/openGames/' + gameID).update({
                status: constants_1.GameStatus[constants_1.GameStatus.completed],
                position: scoreCard.position,
                ratingChange: scoreCard.ratingChange,
                completedGame: scoreCard.score < constants_1.UncompletedGameScore
            });
        }
    });
};
const onMultiPlayerGameStatusUpdated = function (change, context) {
    const gameID = context.params.pushId;
    console.log('game status updated:');
    console.log(change.after.val());
    if (change.after.val() === constants_1.GameStatus[constants_1.GameStatus.completed]) {
        const query = change.after.ref.parent.child('scoreCards');
        query.once("value", function (snapshot) {
            if (snapshot.val() !== null) {
                closeCompletedGame(snapshot, gameID);
            }
            else {
                console.error('failed to get scoreCards for game:' + gameID);
            }
        });
    }
    return change;
};
exports.onMultiPlayerGameStatusUpdated = onMultiPlayerGameStatusUpdated;
const onMultiPlayerStatusUpdated = function (change, context) {
    const gameID = context.params.pushId;
    // 1. check status on game so it is not already completed
    // 2. if not completed check if all player are ready or time has expired
    // 3. set status to completed
    // 4. calculate position
    // 5. calculate rating
    const query = db.ref().child('/multiplayer/games/' + gameID);
    query.transaction(function (game) {
        if (game && game.status && game.status !== constants_1.GameStatus[constants_1.GameStatus.completed]) {
            const scoreCards = [];
            Object.keys(game.scoreCards).forEach(function (participant) {
                scoreCards.push(game.scoreCards[participant]);
            });
            const stillPlaying = scoreCards.some(item => {
                return item.multiplayerStatus !== constants_1.MultiplayerStatus[constants_1.MultiplayerStatus.roundComplete] && item.multiplayerStatus !== constants_1.MultiplayerStatus[constants_1.MultiplayerStatus.retired];
            });
            if (!stillPlaying) {
                console.log('set game status to completed for game: ' + gameID);
                game.status = constants_1.GameStatus[constants_1.GameStatus.completed];
            }
        }
        return game;
    });
    return change;
};
exports.onMultiPlayerStatusUpdated = onMultiPlayerStatusUpdated;
const onGameAdded = function (snapshot, context) {
    console.log('got game - on game added');
    const gameID = context.params.pushId;
    console.log(gameID);
    console.log('starting multiplayer game countdown');
    setTimeout(function () {
        console.log('game expired, set game status to completed for game: ' + gameID);
        const query = db.ref().child('/multiplayer/games/' + gameID);
        query.transaction(function (game) {
            if (game && game.status && game.status !== constants_1.GameStatus[constants_1.GameStatus.completed]) {
                game.status = constants_1.GameStatus[constants_1.GameStatus.completed];
            }
            return game;
        });
    }, 900000);
    return snapshot;
};
exports.onGameAdded = onGameAdded;
const onPlayerAdded = function (snapshot, context) {
    const ref = db.ref().child('multiplayer/PlayerQueue/');
    ref.transaction(function (players) {
        console.log('inside cannon: playerQueue');
        if (players) {
            console.log('players');
            console.log(players);
            const keys = Object.keys(players);
            console.log('user count in player queue: ' + keys.length);
            if (keys.length >= playersInGame) {
                const participants = keys.slice(0, playersInGame);
                const partyPants = {};
                participants.forEach(pants => {
                    partyPants[pants] = players[pants];
                    players[pants] = null;
                });
                const query = 'multiplayer/games/';
                const gameKey = db.ref().child(query).push().key;
                const fancyTime = new Date().getTime();
                console.log('remove participants from playerqueue');
                participants.forEach(id => {
                    db.ref().child('playerData/' + id + '/multiplayerGame').set(gameKey);
                    db.ref().child('playerData/' + id + '/openGames/' + gameKey).set({
                        gameID: gameKey,
                        status: constants_1.GameStatus[constants_1.GameStatus.ongoing],
                        startTime: fancyTime,
                    });
                });
                const tournamentKey = utilities_1.getRandomKey(constants_1.TournamentKeys);
                console.log('got random tournament key');
                db.ref().child(query + gameKey).set({
                    scoreCards: partyPants,
                    startTime: fancyTime,
                    tournament: tournamentKey,
                    status: constants_1.GameStatus[constants_1.GameStatus.ongoing],
                });
            }
        }
        return players;
    });
};
exports.onPlayerAdded = onPlayerAdded;
//# sourceMappingURL=multiplayer.js.map