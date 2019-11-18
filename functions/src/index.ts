'use strict';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import { resolveTournament, startTournament } from './tournament'; // fancy tournaments
import { onPlayerAdded, onPlayerAddedExistingGame, onPlayerRemoved, onGameAdded, onMultiPlayerStatusUpdated, onMultiPlayerGameStatusUpdated, deleteOldMultiplayerGames, closeOldMultiplayerGames } from './multiplayer';
import { startNewProTour, unlockNextProTourRound, resolveProTour } from './protour';
import { startNewOpen, resolveOpen, closeOpenTournaments } from './opentournament';
import { MPonPlayerAdded, MPonPlayerAddedExistingGame, MPonPlayerRemoved, MPonGameAdded, MPonStatusUpdated, MPonGameStatusUpdated, MPdeleteOld, MPcloseOld } from './mp';
import {FGcloseOld} from './friendly';

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
exports.closeOldMultiplayerGames = functions.https.onRequest((req, res) => {
  console.log("running Cleanup Multiplayer Games");
   return closeOldMultiplayerGames(res);   
});

exports.startNewProTour = functions.https.onRequest((req, res) => {
  console.log('start new pro tour');
  return startNewProTour(res);
});

exports.unlockProTourRound = functions.https.onRequest((req, res) => {
  console.log('unlock pro tour round');
  return unlockNextProTourRound(res);
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
exports.deleteOldMultiplayerGames = functions.https.onRequest((req, res) => {
  console.log("running fix multiplayer games");
  deleteOldMultiplayerGames(res);
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




// when a player is queued for multiplayer tournament:
// starts a multiplayer game when there are 4 players in the queue
exports.MPonPlayerAdded = functions.database.ref('/mp/pq/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running MP On Player Added");
     MPonPlayerAdded(snapshot, context);
  });

// when a player is removed from queue for multiplayer tournament:
// only used to update playersInQueue property
exports.MPonPlayerRemoved = functions.database.ref('/mp/pq/{pushId}/')
  .onDelete((snapshot, context) => {
    console.log("running MP On Player Removed");
    MPonPlayerRemoved(snapshot, context);
  });

// when a multiplayer game is created:
// starts the countdown timer and closes game when the game has expired
exports.MPonGameAdded = functions.database.ref('/mp/freshGames/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Multiplayer Game Added");
    MPonGameAdded(snapshot, context).catch(err => {
      console.error("wow");
    });
  });

// when a player has queued up and should be moved to an ongoing game
exports.MPonPlayerAddedExistingGame = functions.database.ref('/mp/currentGame/playersToAdd/{pushId}/')
  .onCreate((snapshot, context) => {
    console.log("running On Player Added Existing Game");
    MPonPlayerAddedExistingGame(snapshot, context).catch(err => {
      console.error("wow");
    });
  });

// when a player's status is updated in a multiplayer game: 
// checks if all players has completed their rounds and closes the game
exports.MPonStatusUpdated = functions.database.ref('/mpg/g/{pushId}/sc/{playerID}/ms')
  .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Status Updated");
    MPonStatusUpdated(snapshot, context);
  });

// when a multiplayer game's status is updated:
// closes the game if the status is completed
exports.MPonGameStatusUpdated = functions.database.ref('/mpg/g/{pushId}/s')
  .onUpdate((snapshot, context) => {
    console.log("running On Multiplayer Game Status Updated");
    MPonGameStatusUpdated(snapshot, context).catch(err => {
      console.error("wow");
    });
  });

// cleanup expired and completed multiplayer games
exports.MPcloseOld = functions.https.onRequest((req, res) => {
  console.log("running Cleanup Multiplayer Games");
   return MPcloseOld(res);   
});

// fix expired but not resolved multiplayer games
exports.MPdeleteOld = functions.https.onRequest((req, res) => {
  console.log("running fix multiplayer games");
  MPdeleteOld(res);
});

// cleanup expired and completed friendly games
exports.FGcloseOld = functions.https.onRequest((req, res) => {
  console.log("running Cleanup Friendly Games");
   return FGcloseOld(res);   
});