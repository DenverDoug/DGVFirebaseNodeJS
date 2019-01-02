'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const tournament_1 = require("./tournament"); // fancy tournaments
const multiplayer_1 = require("./multiplayer");
// when a player is queued for multiplayer tournament:
// starts a multiplayer game when there are 4 players in the queue
exports.onPlayerAdded = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Player Added");
    multiplayer_1.onPlayerAdded(snapshot, context);
});
// when a multiplayer game is created:
// starts the countdown timer and closes game when the game has expired
exports.onMultiPlayerGameAdded = functions.database.ref('/multiplayer/games/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running On Multiplayer Game Added");
    multiplayer_1.onGameAdded(snapshot, context);
});
// when a player's status is updated in a multiplayer game: 
// checks if all players has completed their rounds and closes the game
exports.onMultiPlayerStatusUpdated = functions.database.ref('/multiplayer/games/{pushId}/scoreCards/{playerID}/multiplayerStatus')
    .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Status Updated");
    multiplayer_1.onMultiPlayerStatusUpdated(snapshot, context);
});
// when a multiplayer game's status is updated:
// closes the game if the status is completed
exports.onMultiPlayerGameStatusUpdated = functions.database.ref('/multiplayer/games/{pushId}/status')
    .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Game Status Updated");
    multiplayer_1.onMultiPlayerGameStatusUpdated(snapshot, context);
});
// cleanup expired and completed multiplayer games
exports.cleanupMultiplayerGames = functions.https.onRequest((req, res) => {
    console.log("running Cleanup Multiplayer Games");
    multiplayer_1.cleanupMultiplayerGames(res);
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
//# sourceMappingURL=index.js.map