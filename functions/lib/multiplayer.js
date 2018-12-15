'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
// import * as functions from 'firebase-functions';
// import { getData, getKey } from './utilities';
const db = admin.database();
// enum GameStatus {
//     waitingForPlayer,
//     onGoing,
//     closed,
// }
// const addUserToGame = function (userID: string) {
// }
const onUserAdded = function (snapshot, context) {
    // Grab the current value of what was written to the Realtime Database.
    console.log('got user');
    const userID = context.params.pushId;
    console.log(userID);
    // trams
    const ref = db.ref().child('multiplayer/playerCannon/');
    ref.transaction(function (users) {
        console.log('inside cannon');
        console.log(users);
        if (users && users.val) {
            console.log('userval');
            console.log(users.val());
        }
        if (users) {
            console.log('users');
            console.log(users);
        }
        return users;
    });
};
exports.onUserAdded = onUserAdded;
//# sourceMappingURL=multiplayer.js.map