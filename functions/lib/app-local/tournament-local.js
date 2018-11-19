// // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyCw_PrvryfCWC22KUFPG9Dyq0Sk3DPKakA",
//     authDomain: "discgolfvalley.firebaseapp.com",
//     databaseURL: "https://discgolfvalley.firebaseio.com",
//     projectId: "discgolfvalley",
//     storageBucket: "",
//     messagingSenderId: "480706417920"
// };
// if (!firebase.apps.length) {
//     firebase.initializeApp(config);
// }
// let getData = function (query, success, fail) {
//     query.once("value", function (snapshot) {
//         if (snapshot.val() != null) {
//             success(snapshot);
//         }
//         else {
//             fail();
//         }
//     });
// }
// let getKey = function (data, selectLast) {
//     var keys = Object.keys(data);
//     if (selectLast) {
//         return keys[keys.length - 1];
//     }
//     else {
//         return keys[0];
//     }
// }
// const utils = {
//     getData: getData,
//     getKey: getKey
// }
// var loadPlayer = function () {
//     var ref = firebase.database().ref();
//     var playerDataRef = ref.child('playerData/KhTwgkWKRfguI4CgCMLlTPgd1333');
//     playerDataRef.once("value", function (snapshot) {
//         if (snapshot.val() != null) {
//             // console.log("got playerdata");
//         }
//         else {
//             console.log("nooooo playerdata");
//         }
//     });
// }();
// let loadCurrentTournament = function () {
//     const db = firebase.database();
//     const currentTournamentQuery = db.ref().child('tournaments/').orderByChild("isCurrent").equalTo('true');
//     var success = function (snapshot) {
//         var key = getKey(snapshot.val());
//         createTournament(key);
//     }
//     var fail = function () {
//         // no active tournament, create a new one!
//         createTournament();
//     }
//     utils.getData(currentTournamentQuery, success, fail);
// };
// let getCurrentTournament = new Promise((resolve, reject) => {
//     const db = firebase.database();
//     const currentTournamentQuery = db.ref().child('tournaments/').orderByChild("isCurrent").equalTo('true');
//     var success = function (snapshot) {
//         resolve(snapshot);
//     }
//     var fail = function () {
//         // no current tournament
//         resolve();
//     }
//     utils.getData(currentTournamentQuery, success, fail);
// });
// let prepareNextTournament = function (lastTournamentKey, startTournament) {
//     const db = firebase.database();
//     var success = function (snapshot) {
//         var key = utils.getKey(snapshot.val(), true);
//         // get the first tournament if we reached the end of the tournament list
//         if (key === lastTournamentKey) {
//             getFirstTournament();
//         }
//         else {
//             if (startTournament) {
//                 db.ref().child('tournaments/' + key).update({ isCurrent: "true" });
//             }
//             else {
//                 db.ref().child('tournaments/' + key).update({ isCurrent: "next" });
//             }
//         }
//     }
//     var fail = function () {
//         console.log("there are no tournaments");
//     }
//     var getFirstTournament = function () {
//         const query = db.ref().child('tournaments/').orderByKey().limitToFirst(1);
//         utils.getData(query, success, fail);
//     }
//     if (lastTournamentKey) {
//         let nextTournamentQuery = db.ref().child('tournaments/').orderByKey().startAt(lastTournamentKey).limitToFirst(2);
//         // get the next tournament
//         utils.getData(nextTournamentQuery, success, getFirstTournament);
//     } else {
//         getFirstTournament();
//     }    
// }
// let startNextTournament = function () {
//     console.log("get next");
//     const db = firebase.database();
//     const currentTournamentQuery = db.ref().child('tournaments/').orderByChild("isCurrent").equalTo('next');
//     var success = function (snapshot) {
//         console.log("got next");
//         const key = getKey(snapshot.val());
//         db.ref().child('tournaments/' + key).update({ isCurrent: "true" });
//     }
//     var fail = function () {
//         // no next tournament
//         console.log("no no no next");
//         prepareNextTournament(null, true);
//     }
//     utils.getData(currentTournamentQuery, success, fail);
// };
// let resolveTournament = function () {
//     const db = firebase.database();
//     getCurrentTournament.then((tournament) => {
//         if (tournament) {
//             const key = getKey(tournament.val());
//             const scores = tournament.val()[key].scores;
//             // close current tournament
//             db.ref().child('tournaments/' + key).update({ isCurrent: "false" });
//             if (scores) {
//                 // update user results
//                 setTournamentResults(scores);
//             }
//             // set next tournament
//             prepareNextTournament(key);
//         }
//         else {
//             prepareNextTournament();
//         }
//     });
// };
// let startTournament = function () {
//     startNextTournament();
// };
//# sourceMappingURL=tournament-local.js.map