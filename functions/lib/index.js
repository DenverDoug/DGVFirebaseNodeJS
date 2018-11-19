'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Fancy tournaments
const tournament_1 = require("./tournament");
exports.resolveTournament = functions.https.onRequest((req, res) => {
    console.log("running resolve tournament tournament");
    tournament_1.resolveTournament(res);
});
exports.startTournament = functions.https.onRequest((req, res) => {
    console.log("running start tournament tournament");
    tournament_1.startTournament(res);
});
//# sourceMappingURL=index.js.map