'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const utilities_1 = require("./utilities");
const constants_1 = require("./constants");
const db = admin.database();
const divisions = ['Recreational', 'Advanced', 'Pro'];
const getOpenResults = function (scoreCollection) {
    const tournamentResults = [];
    const positions = [];
    for (const key of Object.keys(scoreCollection)) {
        console.log(scoreCollection[key]);
        tournamentResults.push({
            playerID: key,
            playerName: scoreCollection[key].userName,
            score: scoreCollection[key].score,
            parDiff: scoreCollection[key].parDiff,
            position: -1,
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
        console.log(result.top3);
        positions.push(result);
    });
    return positions;
};
// start new open tournament
function startNewOpen(response) {
    console.log('start new open v2');
    const roundHoles = utilities_1.getRandomKey(constants_1.TournamentKeys);
    const query = db.ref().child('openTournament/');
    return query.child('Recreational/week').once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            console.log('got open week');
            const week = snapshot.val();
            const updates = {};
            divisions.forEach(function (division, iter) {
                updates[division + '/round'] = roundHoles;
                updates[division + '/week/'] = week + 1;
                updates[division + '/division/'] = iter;
                updates[division + '/scores/'] = null;
                updates[division + '/closed/'] = false;
            });
            query.update(updates, function () {
                console.log('all done: start new open');
                response.send('all done: start new open');
            });
        }
    }).catch(error => console.error(error));
}
exports.startNewOpen = startNewOpen;
;
// Resolve open tournament and assign reward objects to players
function resolveOpen(response, request) {
    console.log('resolve open v1');
    const query = db.ref().child('openTournament/');
    const playerQuery = db.ref().child('playerData/');
    const division = request.query.division;
    const updates = {};
    return query.child(division + '/scores/').once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            console.log('got scores');
            const results = getOpenResults(snapshot.val());
            results.forEach(result => {
                updates[result.playerID + '/openResult/position'] = result.position;
                updates[result.playerID + '/openResult/score'] = result.score;
                updates[result.playerID + '/openResult/top3'] = result.top3;
                updates[result.playerID + '/openResult/parDiff'] = result.parDiff;
                updates[result.playerID + '/openResult/division'] = division;
            });
            console.log(updates);
            return playerQuery.update(updates, function () {
                console.log('all done:open resolved');
                response.send('all done: open resolved');
            });
        }
        else {
            console.log('faaak: open not resolvedd');
            response.send('faaak: open not resolved');
            return 0;
        }
    });
}
exports.resolveOpen = resolveOpen;
// closes and locks open tournaments forever
function closeOpenTournaments(response, request) {
    console.log('close and lock and never open again open v1');
    const query = db.ref().child('openTournament/');
    const updates = {};
    const divisionsTest = ['Test'];
    divisionsTest.forEach(function (division) {
        updates[division + '/closed'] = true;
    });
    return query.update(updates, function () {
        console.log('all done: closed all open divisions');
        response.send('all done: closed all open divisions');
    });
}
exports.closeOpenTournaments = closeOpenTournaments;
//# sourceMappingURL=opentournament.js.map