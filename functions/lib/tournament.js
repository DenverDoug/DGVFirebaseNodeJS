'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const utilities_1 = require("./utilities");
const db = admin.database();
var TournamentStatus;
(function (TournamentStatus) {
    TournamentStatus[TournamentStatus["current"] = 0] = "current";
    TournamentStatus[TournamentStatus["closed"] = 1] = "closed";
    TournamentStatus[TournamentStatus["closedNotScored"] = 2] = "closedNotScored";
})(TournamentStatus || (TournamentStatus = {}));
const getTournament = function (status) {
    return new Promise((resolve, reject) => {
        const getTournamentQuery = db.ref().child('tournaments/').orderByChild("status").equalTo(TournamentStatus[status]);
        utilities_1.getData(getTournamentQuery, function (tournament) {
            resolve(tournament);
        }, function () {
            resolve();
        });
    });
};
const setTournamentResults = function (scores) {
    const tournamentResults = [];
    const positions = [];
    console.log("scores");
    console.log(scores);
    for (const key of Object.keys(scores)) {
        console.log(scores[key]);
        tournamentResults.push({
            userID: key,
            score: scores[key].score,
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
    positions.forEach(function (result) {
        const query = 'playerData/' + result.userID + '/results/';
        const resultKey = db.ref().child(query).push().key;
        db.ref().child(query + resultKey).set({
            claimedReward: 0,
            position: result.position,
            participants: positions.length,
            type: "open"
        });
    });
};
const startNextTournament = function (lastTournamentKey) {
    const fail = function () {
        console.warn("There are no tournaments in the dust of this planet.");
    };
    const success = function (snapshot) {
        const key = utilities_1.getKey(snapshot.val(), true);
        // get the first tournament if we got to the last tournament in the database
        if (key === lastTournamentKey) {
            const query = db.ref().child('tournaments/').orderByKey().limitToFirst(1);
            utilities_1.getData(query, success, fail);
        }
        else {
            db.ref().child('tournaments/' + key).update({ status: TournamentStatus[TournamentStatus.current], scores: {} });
        }
    };
    const getFirstTournament = function () {
        const query = db.ref().child('tournaments/').orderByKey().limitToFirst(1);
        utilities_1.getData(query, success, fail);
    };
    if (lastTournamentKey) {
        const nextTournamentQuery = db.ref().child('tournaments/').orderByKey().startAt(lastTournamentKey).limitToFirst(2);
        // get next tournament based on the last tournament key
        utilities_1.getData(nextTournamentQuery, success, getFirstTournament);
    }
    else {
        getFirstTournament();
    }
};
// 12.00: find current set status to closed not scored
// find next tournament set status to current
// clear scores on next
function startTournament(response) {
    getTournament(TournamentStatus.current).then((tournament) => {
        if (tournament) {
            const key = utilities_1.getKey(tournament.val(), false);
            db.ref().child('tournaments/' + key).update({ status: TournamentStatus[TournamentStatus.closedNotScored] });
            startNextTournament(key);
        }
        else {
            startNextTournament("");
        }
        response.send("start tournament function completed");
    }).catch(error => console.error(error));
}
exports.startTournament = startTournament;
;
// later: find closed not scored tournament
// assign scores + set participants
// set status to closed
function resolveTournament(response) {
    getTournament(TournamentStatus.closedNotScored).then((tournament) => {
        console.log("got tournament");
        if (tournament) {
            const key = utilities_1.getKey(tournament.val(), false);
            const scores = tournament.val()[key].scores;
            console.log("got tournament key: " + key);
            if (scores) {
                console.log("got tournament scores");
                // update user results
                setTournamentResults(scores);
            }
            // close tournament
            db.ref().child('tournaments/' + key).update({ status: TournamentStatus[TournamentStatus.closed] });
            response.send("resolve tournament function completed");
        }
    }).catch(error => handleError(error));
    function handleError(message) {
        console.error(message);
        response.send("resolve tournament function completed");
    }
}
exports.resolveTournament = resolveTournament;
;
//# sourceMappingURL=tournament.js.map