'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// Fancy tournaments
const tournament_1 = require("./tournament");
const multiplayer_1 = require("./multiplayer");
exports.onUserAdded = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
    .onCreate((snapshot, context) => {
    console.log("running onUserAdded");
    multiplayer_1.onUserAdded(snapshot, context);
});
exports.resolveTournament = functions.https.onRequest((req, res) => {
    console.log("running resolve tournament");
    tournament_1.resolveTournament(res);
});
exports.startTournament = functions.https.onRequest((req, res) => {
    console.log("running start tournament tournament");
    tournament_1.startTournament(res);
});
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({ original: original }).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('uppercase').set(uppercase);
});
//# sourceMappingURL=index.js.map