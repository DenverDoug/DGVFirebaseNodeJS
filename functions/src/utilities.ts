'use strict';

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


export {
    getData,
    getKey
}