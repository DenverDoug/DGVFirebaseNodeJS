"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const db = admin.database();
const FGcloseOld = function (response) {
    const fancyTime = new Date();
    const deleteGameTime = Math.floor((fancyTime.setHours(fancyTime.getHours() - 1)) / 1000);
    const query = db.ref().child('fg/');
    console.log('fetching old friendly games to remove ' + deleteGameTime);
    //return query.orderByKey().limitToFirst(10000).once("value", function (snapshot: any) {
    return query.child('ids').once("value", function (snapshot) {
        if (snapshot.val() !== null) {
            console.log('got ids');
            const updates = {};
            snapshot.forEach(id => {
                console.log(id.val());
                if (id.val() < deleteGameTime) {
                    updates['/g/' + id.key] = null;
                    updates['/ids/' + id.key] = null;
                    console.log(id.key + ' has been deleted');
                }
            });
            return query.update(updates);
        }
        return 0;
    }).then(() => {
        console.log('all done: cleanupFriendlyGames');
        response.send('all done: cleanupFriendlyGames');
    }).catch(error => console.error(error));
};
exports.FGcloseOld = FGcloseOld;
//# sourceMappingURL=friendly.js.map