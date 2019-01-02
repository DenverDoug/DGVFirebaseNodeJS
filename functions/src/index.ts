'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import { resolveTournament, startTournament } from './tournament'; // fancy tournaments
import { onPlayerAdded, onGameAdded, onMultiPlayerStatusUpdated, onMultiPlayerGameStatusUpdated, cleanupMultiplayerGames } from './multiplayer';

// when a player is queued for multiplayer tournament:
// starts a multiplayer game when there are 4 players in the queue
exports.onPlayerAdded = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Player Added");
    onPlayerAdded(snapshot, context);
  });

// when a multiplayer game is created:
// starts the countdown timer and closes game when the game has expired
exports.onMultiPlayerGameAdded = functions.database.ref('/multiplayer/games/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Multiplayer Game Added");
    onGameAdded(snapshot, context);
  });

// when a player's status is updated in a multiplayer game: 
// checks if all players has completed their rounds and closes the game
exports.onMultiPlayerStatusUpdated = functions.database.ref('/multiplayer/games/{pushId}/scoreCards/{playerID}/multiplayerStatus')
  .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Status Updated");
    onMultiPlayerStatusUpdated(snapshot, context);
  });

// when a multiplayer game's status is updated:
// closes the game if the status is completed
exports.onMultiPlayerGameStatusUpdated = functions.database.ref('/multiplayer/games/{pushId}/status')
  .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Game Status Updated");
    onMultiPlayerGameStatusUpdated(snapshot, context);
  });

  // cleanup expired and completed multiplayer games
  exports.cleanupMultiplayerGames = functions.https.onRequest((req, res) => {
    console.log("running Cleanup Multiplayer Games");
    cleanupMultiplayerGames(res);
  });

// resolves fancy tournament
exports.resolveTournament = functions.https.onRequest((req, res) => {
  console.log("running Resolve Tournament");
  resolveTournament(res);
});

// starts fancy tournament
exports.startTournament = functions.https.onRequest((req, res) => {
  console.log("running Start Tournament");
  startTournament(res);
});