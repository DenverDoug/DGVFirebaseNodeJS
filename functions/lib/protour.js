'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const utilities_1 = require("./utilities");
const constants_1 = require("./constants");
const db = admin.database();
const divisions = ['Recreational', 'Advanced', 'Pro'];
const getProTourResults = function (scoreCollection) {
    const tournamentResults = [];
    const positions = [];
    for (const key of Object.keys(scoreCollection)) {
        //console.log(scoreCollection[key]);
        var total = 0;
        var par = 0;
        var valid = true;
        for (var it = 0; it < 4; it++) {
            if (scoreCollection[key].scores[it] !== 0 && scoreCollection[key].scores[it] !== 999) {
                total += scoreCollection[key].scores[it];
                par += scoreCollection[key].pars[it];
            }
            else {
                valid = false;
                total = 999;
            }
        }
        tournamentResults.push({
            playerID: key,
            playerName: scoreCollection[key].playerName,
            score: total,
            parDiff: par,
            completeRound: valid,
            position: -1,
            participants: Object.keys(scoreCollection).length,
            top3: [],
        });
    }
    const sortedResults = tournamentResults.sort(function (a, b) {
        return a.score - b.score;
    });
    const firstPlace = {};
    const secondPlace = {};
    const thirdPlace = {};
    if (sortedResults[Object.keys(sortedResults)[0]] == null) {
        firstPlace['playerName'] = "NA";
        firstPlace['score'] = 0;
    }
    else {
        firstPlace['playerName'] = sortedResults[Object.keys(sortedResults)[0]].playerName;
        firstPlace['score'] = sortedResults[Object.keys(sortedResults)[0]].score;
    }
    if (sortedResults[Object.keys(sortedResults)[1]] == null) {
        secondPlace['playerName'] = "NA";
        secondPlace['score'] = 0;
    }
    else {
        secondPlace['playerName'] = sortedResults[Object.keys(sortedResults)[1]].playerName;
        secondPlace['score'] = sortedResults[Object.keys(sortedResults)[1]].score;
    }
    if (sortedResults[Object.keys(sortedResults)[2]] == null) {
        thirdPlace['playerName'] = "NA";
        thirdPlace['score'] = 0;
    }
    else {
        thirdPlace['playerName'] = sortedResults[Object.keys(sortedResults)[2]].playerName;
        thirdPlace['score'] = sortedResults[Object.keys(sortedResults)[2]].score;
    }
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
        result.top3.push(firstPlace);
        result.top3.push(secondPlace);
        result.top3.push(thirdPlace);
        //console.log(result.top3);
        if (result.position < 11) {
            console.log("position " + result.position);
            console.log(result.playerID + " " + result.playerName);
        }
        positions.push(result);
    });
    return positions;
};
//start new pro tour
function startNewProTour(response) {
    console.log('start new pro tour v2');
    const roundHoles = [];
    for (var i = 0; i < 4; i++) {
        roundHoles.push(utilities_1.getRandomKey(constants_1.TournamentKeys));
    }
    ;
    const query = db.ref().child('proTour/');
    return query.child('currentRound').once("value", function (snap) {
        if (snap.val() !== null) {
            const currentRound = snap.val();
            if (currentRound > 4) {
                console.log('current round is 5, starting new pro tour');
                return query.child('Recreational/tourProperties/week').once("value", function (snapshot) {
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
                            updates[division + '/closed/'] = false;
                            updates[division + '/tourProperties/rounds/0/unlocked'] = true;
                            updates[division + '/tourProperties/rounds/0/holesID'] = roundHoles[0];
                            updates[division + '/tourProperties/rounds/1/unlocked'] = false;
                            updates[division + '/tourProperties/rounds/1/holesID'] = roundHoles[1];
                            updates[division + '/tourProperties/rounds/2/unlocked'] = false;
                            updates[division + '/tourProperties/rounds/2/holesID'] = roundHoles[2];
                            updates[division + '/tourProperties/rounds/3/unlocked'] = false;
                            updates[division + '/tourProperties/rounds/3/holesID'] = roundHoles[3];
                            updates[division + '/tourProperties/week/'] = week + 1;
                            updates[division + '/tourProperties/division/'] = iter;
                            updates[division + '/scores/'] = null;
                            updates[division + '/tourProperties/closed/'] = false;
                        });
                        updates['currentRound/'] = 0; // tournament is officially opened
                        return query.update(updates, function () {
                            console.log('all done: start new protour');
                            response.send('all done: start new protour');
                        });
                    }
                    else {
                        response.send('could not load pro tour week');
                        return 0;
                    }
                });
            }
            else {
                response.send('skipping starting new pro tour, current round is ' + currentRound);
                console.log('skipping starting new pro tour, current round is ' + currentRound);
                return 0;
            }
        }
        else {
            response.send('could not load current round in start pro tour');
            return 0;
        }
    }).catch(error => console.error(error));
}
exports.startNewProTour = startNewProTour;
;
// Unlock a Pro Tour Round. 
function unlockNextProTourRound(response) {
    console.log('unlock round v1');
    const query = db.ref().child('proTour/');
    const updates = {};
    return query.child('currentRound').once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            const currentRound = snapshot.val();
            const round = currentRound + 1;
            updates['/currentRound'] = round;
            if (round < 4) {
                updates['/Recreational/tourProperties/rounds/' + round + '/unlocked'] = true;
                updates['/Advanced/tourProperties/rounds/' + round + '/unlocked'] = true;
                updates['/Pro/tourProperties/rounds/' + round + '/unlocked'] = true;
            }
            else if (round > 4) {
                updates['/Recreational/tourProperties/closed'] = true;
                updates['/Advanced/tourProperties/closed'] = true;
                updates['/Pro/tourProperties/closed'] = true;
            }
            return query.update(updates, function () {
                console.log('all done: round unlocked');
                response.send('all done: round unlocked');
                return 0;
            });
        }
        else {
            response.send('could not load current round');
            return 0;
        }
    }).catch(error => console.error(error));
}
exports.unlockNextProTourRound = unlockNextProTourRound;
;
// Close pro tour and assign reward objects to players
function resolveProTour(response, request) {
    console.log('resolve pro tour v1');
    const query = db.ref().child('proTour/');
    const playerQuery = db.ref().child('playerData/');
    const division = request.query.division;
    const updates = {};
    const DivisionInts = {
        'Recreational': 0,
        'Advanced': 1,
        'Pro': 2,
    };
    const divisionInt = DivisionInts[division];
    return query.child('/currentRound/').once("value", function (snap) {
        if (snap.val() !== null) {
            const currentRound = snap.val();
            if (currentRound > 4) {
                console.log('current round is 5, time to resolve pro tour');
                return query.child(division + '/scores/').once("value", function (snapshot) {
                    if (snapshot.val() !== null) {
                        console.log('got scores');
                        const results = getProTourResults(snapshot.val());
                        results.forEach(result => {
                            updates[result.playerID + '/proTourResult/position'] = result.position;
                            updates[result.playerID + '/proTourResult/score'] = result.score;
                            updates[result.playerID + '/proTourResult/completeRound'] = result.completeRound;
                            updates[result.playerID + '/proTourResult/top3'] = result.top3;
                            updates[result.playerID + '/proTourResult/parDiff'] = result.parDiff;
                            updates[result.playerID + '/proTourResult/division'] = divisionInt;
                            updates[result.playerID + '/proTourResult/participants'] = result.participants;
                        });
                        //console.log(updates);
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
            else {
                response.send('current rount is not 5 currentRound: ' + currentRound);
                return 0;
            }
        }
        else {
            response.send('no currentRound loaded');
            return 0;
        }
    });
}
exports.resolveProTour = resolveProTour;
//# sourceMappingURL=protour.js.map