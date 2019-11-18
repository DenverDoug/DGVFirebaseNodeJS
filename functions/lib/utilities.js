'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function getData(query, success, fail) {
    query.once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            success(snapshot);
        }
        else {
            fail();
        }
    });
}
exports.getData = getData;
function getKey(data, selectLast) {
    const keys = Object.keys(data);
    if (selectLast) {
        return keys[keys.length - 1];
    }
    else {
        return keys[0];
    }
}
exports.getKey = getKey;
function getPlayerPositions(playerResults) {
    const positions = [];
    const sortedResults = playerResults.sort(function (a, b) {
        a.score = a.score ? a.score : constants_1.UncompletedGameScore;
        b.score = b.score ? b.score : constants_1.UncompletedGameScore;
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
exports.getPlayerPositions = getPlayerPositions;
function MPgetPlayerPositions(playerResults) {
    const positions = [];
    const sortedResults = playerResults.sort(function (a, b) {
        a.t = a.t ? a.t : constants_1.UncompletedGameScore;
        b.t = b.t ? b.t : constants_1.UncompletedGameScore;
        return a.t - b.t;
    });
    sortedResults.forEach(function (result, index) {
        if (index === 0) {
            result.position = index + 1;
        }
        else {
            if (positions[index - 1].t === result.t) {
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
exports.MPgetPlayerPositions = MPgetPlayerPositions;
function getRandomKey(keys) {
    const random = getRandomInt(0, keys.length - 1);
    return keys[random];
}
exports.getRandomKey = getRandomKey;
function getRandomInt(min, max) {
    const ceilMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
}
//# sourceMappingURL=utilities.js.map