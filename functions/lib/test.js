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
function setUserRatings(scores) {
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
            rating: scores[key].rating
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
        if (result.userID === "LEFTECfAlJbgyFFDGbQ5Dr6X2fx2") {
            const query = 'playerData/' + result.userID + '/results/';
            const mod = giveMeMyRating(result.rating, positions.length, result.position);
            const resultKey = db.ref().child(query).push().key;
            db.ref().child(query + resultKey).set({
                claimedReward: 0,
                position: result.position,
                participants: positions.length,
                type: "open",
                rating: result.rating + mod,
                mod: mod
            });
        }
    });
}
;
function giveMeMyRating(oldRating, participantsCount, myPosition) {
    const percentile = myPosition / participantsCount < 0.01 ? 0.01 : myPosition / participantsCount;
    const log = Math.log(percentile) / Math.log(0.01);
    const scoreModifier = oldRating === 0 ? 100 / 10000 : oldRating / 1000;
    const scoreMod = 1 - scoreModifier;
    return 50 * scoreMod * log;
}
function testRatings(res) {
    getTournament(TournamentStatus.current).then((tournament) => {
        if (tournament) {
            console.log("test ratings got current tournament");
            const key = utilities_1.getKey(tournament.val(), false);
            const scores = tournament.val()[key].scores;
            console.log("got tournament key: " + key);
            if (scores) {
                console.log("got tournament scores");
                // update user ratings
                setUserRatings(scores);
            }
        }
    }).catch(error => console.error(error));
    // all done
    res.send("test ratings script completed");
}
exports.testRatings = testRatings;
;
//# sourceMappingURL=test.js.map