'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Fancy tournaments
import { resolveTournament, startTournament } from './tournament';

exports.resolveTournament = functions.https.onRequest((req, res) => {
  console.log("running resolve tournament tournament");
  resolveTournament(res);
});

exports.startTournament = functions.https.onRequest((req, res) => {
  console.log("running start tournament tournament");
  startTournament(res);
});
