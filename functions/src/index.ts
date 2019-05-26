'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import { resolveTournament, startTournament } from './tournament'; // fancy tournaments
import { onPlayerAdded, onPlayerAddedExistingGame, onPlayerRemoved, onGameAdded, onMultiPlayerStatusUpdated, onMultiPlayerGameStatusUpdated, cleanupMultiplayerGames, closeBrokenGames } from './multiplayer';
import { startNewProTour, unlockProTourRound, resolveProTour } from './protour';
import { startNewOpen, resolveOpen, closeOpenTournaments } from './opentournament';

// when a player is queued for multiplayer tournament:
// starts a multiplayer game when there are 4 players in the queue
exports.onPlayerAdded = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Player Added");
     onPlayerAdded(snapshot, context);
  });

// when a player is removed from queue for multiplayer tournament:
// only used to update playersInQueue property
exports.onPlayerRemoved = functions.database.ref('/multiplayer/PlayerQueue/{pushId}/')
  .onDelete((snapshot, context) => {
    console.log("running On Player Removed");
    onPlayerRemoved(snapshot, context);
  });

// when a multiplayer game is created:
// starts the countdown timer and closes game when the game has expired
exports.onMultiPlayerGameAdded = functions.database.ref('/multiplayer/freshGames/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Multiplayer Game Added");
    onGameAdded(snapshot, context).catch(err => {
      console.error("wow");
    });
  });

// when a player has queued up and should be moved to an ongoing game
exports.onPlayerAddedExistingGame = functions.database.ref('/multiplayer/currentGame/playersToAdd/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Player Added Existing Game");
    onPlayerAddedExistingGame(snapshot, context).catch(err => {
      console.error("wow");
    });
  });

// when a player's status is updated in a multiplayer game: 
// checks if all players has completed their rounds and closes the game
exports.onMultiPlayerStatusUpdated = functions.database.ref('/multiplayerOngoing/games/{pushId}/scoreCards/{playerID}/multiplayerStatus')
  .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Status Updated");
    onMultiPlayerStatusUpdated(snapshot, context);
  });

// when a multiplayer game's status is updated:
// closes the game if the status is completed
exports.onMultiPlayerGameStatusUpdated = functions.database.ref('/multiplayerOngoing/games/{pushId}/status')
  .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Game Status Updated");
    onMultiPlayerGameStatusUpdated(snapshot, context).catch(err => {
      console.error("wow");
    });

  });

// cleanup expired and completed multiplayer games
exports.cleanupMultiplayerGames = functions.https.onRequest((req, res) => {
  console.log("running Cleanup Multiplayer Games");
   return cleanupMultiplayerGames(res);   
});

exports.startNewProTour = functions.https.onRequest((req, res) => {
  console.log('start new pro tour');
  return startNewProTour(res);
});

exports.unlockProTourRound = functions.https.onRequest((req, res) => {
  console.log('unlock pro tour round');
  return unlockProTourRound(res, req);
});

exports.resolveProTour = functions.https.onRequest((req, res) => {
  console.log('resolve pro tour');
  return resolveProTour(res, req);
});

exports.startNewOpen = functions.https.onRequest((req, res) => {
  console.log('start open');
  return startNewOpen(res);
});

exports.resolveOpen = functions.https.onRequest((req, res) => {
  console.log('resolve open');
  return resolveOpen(res, req);
});

exports.closeOpen = functions.https.onRequest((req, res) => {
  console.log('close open');
  return closeOpenTournaments(res, req);
});

// fix expired but not resolved multiplayer games
exports.closeBrokenGames = functions.https.onRequest((req, res) => {
  console.log("running fix multiplayer games");
  closeBrokenGames(res);
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