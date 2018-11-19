'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=utilities.js.map