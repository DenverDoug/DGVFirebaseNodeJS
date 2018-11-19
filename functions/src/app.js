import * as admin from 'firebase-admin';
import { getData, getKey } from './utilities';

let getCurrentTournament = new Promise((resolve, reject) => {
    const db = firebase.database();
    const currentTournamentQuery = db.ref().child('tournaments/').orderByChild("isCurrent").equalTo('true');

    var success = function (snapshot) {
        resolve(snapshot);
    }

    var fail = function () {
        // no current tournament
        resolve();
    }

    getData(currentTournamentQuery, success, fail);
});

let setTournamentResults = function (scores) {
    let tournamentResults = [];
    let positions = [];

    for (let [key, value] of Object.entries(scores)) {
        tournamentResults.push({
            userID: key,
            score: value.score,
            position: -1
        });
    }

    let sortedResults = tournamentResults.sort(function (a, b) {
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
                result.position = positions[index - 1].position + 1;
            }
        }

        positions.push(result);
    });

    const db = firebase.database();

    positions.forEach(function (result) {
        var query = 'playerData/' + result.userID + '/results/';

        var resultKey = firebase.database().ref().child(query).push().key;
        db.ref().child(query + resultKey).set({
            claimedReward: 0,
            position: result.position,
            type: "open"
        });
    });
};

let prepareNextTournament = function (lastTournamentKey, startTournament) {
    const db = firebase.database();

    var success = function (snapshot) {
        var key = utils.getKey(snapshot.val(), true);

        // get the first tournament if we reached the end of the tournament list
        if (key === lastTournamentKey) {
            getFirstTournament();
        }
        else {
            if (startTournament) {
                db.ref().child('tournaments/' + key).update({ isCurrent: "true" });
            }
            else {
                db.ref().child('tournaments/' + key).update({ isCurrent: "next" });
            }
        }
    }

    var fail = function () {
        console.log("there are no tournaments");
    }

    var getFirstTournament = function () {
        const query = db.ref().child('tournaments/').orderByKey().limitToFirst(1);
        utils.getData(query, success, fail);
    }

    if (lastTournamentKey) {
        let nextTournamentQuery = db.ref().child('tournaments/').orderByKey().startAt(lastTournamentKey).limitToFirst(2);
        
        // get the next tournament
        utils.getData(nextTournamentQuery, success, getFirstTournament);
    } else {
        getFirstTournament();
    }    
}

let startNextTournament = function () {
    console.log("get next");
    const db = firebase.database();
    const currentTournamentQuery = db.ref().child('tournaments/').orderByChild("isCurrent").equalTo('next');

    var success = function (snapshot) {
        console.log("got next");
        const key = getKey(snapshot.val(), false);
        db.ref().child('tournaments/' + key).update({ isCurrent: "true" });
    }

    var fail = function () {
        // no next tournament
        console.log("no no no next");
        prepareNextTournament(null, true);
    }

    utils.getData(currentTournamentQuery, success, fail);
};

let resolveTournament = function () {
    const db = firebase.database();

    getCurrentTournament.then((tournament) => {
        if (tournament) {
            const key = getKey(tournament.val(), false);
            const scores = tournament.val()[key].scores;

            // close current tournament
            db.ref().child('tournaments/' + key).update({ isCurrent: "false" });

            if (scores) {
                // update user results
                setTournamentResults(scores);
            }

            // set next tournament
            prepareNextTournament(key, false);
        }
        else {
            prepareNextTournament(null, false);
        }
    });
};


module.exports = {
    resolve: resolveTournament,
    start: startNextTournament,
    resolveTest: function () {
        console.log("resolve test");
    },
    startTest: function () {
        console.log("start test");
    }
}