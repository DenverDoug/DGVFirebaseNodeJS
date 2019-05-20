'use strict';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { getData, getKey, getRandomKey } from './utilities';
import { TournamentStatus, TournamentKeys } from './constants';

const db = admin.database();
const divisions = ['Recreational', 'Advanced', 'Pro'];

const getProTourResults = function (scoreCollection) {
    const tournamentResults = [];
    const positions = [];

    //console.log("scores");
    //console.log(scores);

    for (const key of Object.keys(scoreCollection)) {
        console.log(scoreCollection[key]);
        var total = 0;
        var valid = true;
        
        for (var it = 0; it < 4; it++) {
            if (scoreCollection[key].scores[it] !== 0 && scoreCollection[key].scores[it]  !== 999) {
                total += scoreCollection[key].scores[it];
            }
            else {
                valid = false;
            }
        }
        
        tournamentResults.push({
            playerID: key,
            score: total,
            completeRound: valid,
            position: -1,
        });
    }
    const sortedResults = tournamentResults.sort(function (a, b) {
        return a.score - b.score;
    });
    sortedResults.forEach(function (result, index) {
        if (index === 0) {
            result.position = index + 1;
        }
        else {
            if (positions[index - 1].score === result.score) {
                result.position = positions[index - 1].position;
            }
            else {
                result.position = index + 1;
            }
        }
        positions.push(result);
    });
    return positions;
}

//start new pro tour
function startNewProTour(response: functions.Response) {
    console.log('start new pro tour v2')
    const roundHoles = [];
    for (var i = 0; i < 4; i++) {
        roundHoles.push(getRandomKey(TournamentKeys));
    };
    const query = db.ref().child('proTour/');

    return query.child('Recreational/week').once("value", function (snapshot: any) {
        if (snapshot.val() !== null) {
            console.log('got pro tour week');
            const week = snapshot.val();
            const updates = {};
            divisions.forEach(function (division, iter) {
                updates[division + '/rounds/0/unlocked'] = true;
                updates[division + '/rounds/0/holesID'] = roundHoles[0];
                updates[division + '/rounds/1/unlocked'] = false;
                updates[division + '/rounds/1/holesID'] = roundHoles[1];
                updates[division + '/rounds/2/unlocked'] = false;
                updates[division + '/rounds/2/holesID'] = roundHoles[2];
                updates[division + '/rounds/3/unlocked'] = false;
                updates[division + '/rounds/3/holesID'] = roundHoles[3];
                updates[division + '/week/'] = week + 1;
                updates[division + '/division/'] = iter;
                updates[division + '/scores/'] = null;
            })
            query.update(updates, function () {
                console.log('all done: start new protour');
                response.send('all done: start new protour');
            });
        }
    }).catch(error => console.error(error));
};

// Unlock a Pro Tour Round. 
function unlockProTourRound(response: functions.Response, request: functions.Request) {
    console.log('unlock round v1');
    const round = request.query.round;
    const query = db.ref().child('proTour/');
    const updates = {};

    updates['/Recreational/rounds/' + round + '/unlocked'] = true;
    updates['/Advanced/rounds/' + round + '/unlocked'] = true;
    updates['/Pro/rounds/' + round + '/unlocked'] = true;
    return query.update(updates, function () {
        console.log('all done: round unlocked');
        response.send('all done: round unlocked');
    });
};

// Close pro tour and assign reward objects to players
function resolveProTour(response: functions.Response, request: functions.Request) {
    console.log('resolve pro tour v1');
    const query = db.ref().child('proTour/');
    const playerQuery = db.ref().child('playerData/');
    const division = request.query.division;
    const updates = {};

    return query.child(division + '/scores/').once("value", function (snapshot: any) {
        if (snapshot.val() !== null) {
            console.log('got scores');
            const results = getProTourResults(snapshot.val())
            results.forEach(result => {
                updates[result.playerID + '/proTourResult/position'] = result.position;
                updates[result.playerID + '/proTourResult/score'] = result.score;
                updates[result.playerID + '/proTourResult/completeRound'] = result.completeRound;
            });
            console.log(updates);
            return playerQuery.update(updates, function () {
            console.log('all done: pro tour resolved');
            response.send('all done: pro tour resolved');
            });            
        }
        else {
            console.log('faaak: pro tour not resolved');
            response.send('faaak: pro tour not resolved');
            return 0;
        }
    });
}

export {
    startNewProTour,
    unlockProTourRound,
    resolveProTour,
};
