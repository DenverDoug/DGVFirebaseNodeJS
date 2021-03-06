'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const tournament_1 = require("./tournament"); // fancy tournaments
const multiplayer_1 = require("./multiplayer");
const protour_1 = require("./protour");
const opentournament_1 = require("./opentournament");
const mp_1 = require("./mp");
const friendly_1 = require("./friendly");
// when a player is queued for multiplayer tournament:
// starts a multiplayer game when there are 4 players in the queue
exports.onPlayerAdded = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Player Added");
    multiplayer_1.onPlayerAdded(snapshot, context);
});
// when a player is removed from queue for multiplayer tournament:
// only used to update playersInQueue property
exports.onPlayerRemoved = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
    .onDelete((snapshot, context) => {
    console.log("running On Player Removed");
    multiplayer_1.onPlayerRemoved(snapshot, context);
});
// when a multiplayer game is created:
// starts the countdown timer and closes game when the game has expired
exports.onMultiPlayerGameAdded = functions.database.ref('/multiplayer/freshGames/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Multiplayer Game Added");
    multiplayer_1.onGameAdded(snapshot, context).catch(err => {
        console.error("wow");
    });
});
// when a player has queued up and should be moved to an ongoing game
exports.onPlayerAddedExistingGame = functions.database.ref('/multiplayer/currentGame/playersToAdd/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Player Added Existing Game");
    multiplayer_1.onPlayerAddedExistingGame(snapshot, context).catch(err => {
        console.error("wow");
    });
});
// when a player's status is updated in a multiplayer game: 
// checks if all players has completed their rounds and closes the game
exports.onMultiPlayerStatusUpdated = functions.database.ref('/multiplayerOngoing/games/{pushId}/scoreCards/{playerID}/multiplayerStatus')
    .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Status Updated");
    multiplayer_1.onMultiPlayerStatusUpdated(snapshot, context);
});
// when a multiplayer game's status is updated:
// closes the game if the status is completed
exports.onMultiPlayerGameStatusUpdated = functions.database.ref('/multiplayerOngoing/games/{pushId}/status')
    .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Game Status Updated");
    multiplayer_1.onMultiPlayerGameStatusUpdated(snapshot, context).catch(err => {
        console.error("wow");
    });
});
// cleanup expired and completed multiplayer games
exports.closeOldMultiplayerGames = functions.https.onRequest((req, res) => {
    console.log("running Cleanup Multiplayer Games");
    return multiplayer_1.closeOldMultiplayerGames(res);
});
exports.startNewProTour = functions.https.onRequest((req, res) => {
    console.log('start new pro tour');
    return protour_1.startNewProTour(res);
});
exports.unlockProTourRound = functions.https.onRequest((req, res) => {
    console.log('unlock pro tour round');
    return protour_1.unlockNextProTourRound(res);
});
exports.resolveProTour = functions.https.onRequest((req, res) => {
    console.log('resolve pro tour');
    return protour_1.resolveProTour(res, req);
});
exports.startNewOpen = functions.https.onRequest((req, res) => {
    console.log('start open');
    return opentournament_1.startNewOpen(res);
});
exports.resolveOpen = functions.https.onRequest((req, res) => {
    console.log('resolve open');
    return opentournament_1.resolveOpen(res, req);
});
exports.closeOpen = functions.https.onRequest((req, res) => {
    console.log('close open');
    return opentournament_1.closeOpenTournaments(res, req);
});
// fix expired but not resolved multiplayer games
exports.deleteOldMultiplayerGames = functions.https.onRequest((req, res) => {
    console.log("running fix multiplayer games");
    multiplayer_1.deleteOldMultiplayerGames(res);
});
// resolves fancy tournament
exports.resolveTournament = functions.https.onRequest((req, res) => {
    console.log("running Resolve Tournament");
    tournament_1.resolveTournament(res);
});
// starts fancy tournament
exports.startTournament = functions.https.onRequest((req, res) => {
    console.log("running Start Tournament");
    tournament_1.startTournament(res);
});
// when a player is queued for multiplayer tournament:
// starts a multiplayer game when there are 4 players in the queue
exports.MPonPlayerAdded = functions.database.ref('/mp/pq/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running MP On Player Added");
    mp_1.MPonPlayerAdded(snapshot, context);
});
// when a player is removed from queue for multiplayer tournament:
// only used to update playersInQueue property
exports.MPonPlayerRemoved = functions.database.ref('/mp/pq/{pushId}/')
    .onDelete((snapshot, context) => {
    console.log("running MP On Player Removed");
    mp_1.MPonPlayerRemoved(snapshot, context);
});
// when a multiplayer game is created:
// starts the countdown timer and closes game when the game has expired
exports.MPonGameAdded = functions.database.ref('/mp/freshGames/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Multiplayer Game Added");
    mp_1.MPonGameAdded(snapshot, context).catch(err => {
        console.error("wow");
    });
});
// when a player has queued up and should be moved to an ongoing game
exports.MPonPlayerAddedExistingGame = functions.database.ref('/mp/currentGame/playersToAdd/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Player Added Existing Game");
    mp_1.MPonPlayerAddedExistingGame(snapshot, context).catch(err => {
        console.error("wow");
    });
});
// when a player's status is updated in a multiplayer game: 
// checks if all players has completed their rounds and closes the game
exports.MPonStatusUpdated = functions.database.ref('/mpg/g/{pushId}/sc/{playerID}/ms')
    .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Status Updated");
    mp_1.MPonStatusUpdated(snapshot, context);
});
// when a multiplayer game's status is updated:
// closes the game if the status is completed
exports.MPonGameStatusUpdated = functions.database.ref('/mpg/g/{pushId}/s')
    .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Game Status Updated");
    mp_1.MPonGameStatusUpdated(snapshot, context).catch(err => {
        console.error("wow");
    });
});
// cleanup expired and completed multiplayer games
exports.MPcloseOld = functions.https.onRequest((req, res) => {
    console.log("running Cleanup Multiplayer Games");
    return mp_1.MPcloseOld(res);
});
// fix expired but not resolved multiplayer games
exports.MPdeleteOld = functions.https.onRequest((req, res) => {
    console.log("running fix multiplayer games");
    mp_1.MPdeleteOld(res);
});
// cleanup expired and completed friendly games
exports.FGcloseOld = functions.https.onRequest((req, res) => {
    console.log("running Cleanup Friendly Games");
    return friendly_1.FGcloseOld(res);
});
//# sourceMappingURL=index.js.map