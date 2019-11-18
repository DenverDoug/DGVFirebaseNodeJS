'use strict';
import { UncompletedGameScore } from './constants';

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

function getKey(data, selectLast) {
    const keys = Object.keys(data);

    if (selectLast) {
        return keys[keys.length - 1];
    }
    else {
        return keys[0];
    }
}

function getPlayerPositions (playerResults: Array<any>) {
    const positions = [];
    const sortedResults = playerResults.sort(function (a, b) {
        a.score = a.score ? a.score : UncompletedGameScore;
        b.score = b.score ? b.score : UncompletedGameScore;

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

function MPgetPlayerPositions (playerResults: Array<any>) {
    const positions = [];
    const sortedResults = playerResults.sort(function (a, b) {
        a.t = a.t ? a.t : UncompletedGameScore;
        b.t = b.t ? b.t : UncompletedGameScore;

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

function getRandomKey(keys: Array<string>) {
    const random = getRandomInt(0, keys.length - 1);
    return keys[random];
}


function getRandomInt(min: number, max: number) {
    const ceilMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
}

export {
    getData,
    getKey,
    getRandomKey,
    getPlayerPositions,
    MPgetPlayerPositions
}