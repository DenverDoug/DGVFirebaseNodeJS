'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Fancy tournaments
import { resolveTournament, startTournament } from './tournament';
import { onUserAdded } from './multiplayer';

exports.onUserAdded = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
.onCreate((snapshot, context) => {
  console.log("running onUserAdded");
  onUserAdded(snapshot, context);
});

exports.resolveTournament = functions.https.onRequest((req, res) => {
  console.log("running resolve tournament");
  resolveTournament(res);
});

exports.startTournament = functions.https.onRequest((req, res) => {
  console.log("running start tournament tournament");
  startTournament(res);
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
