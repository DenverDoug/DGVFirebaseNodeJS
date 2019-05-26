"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiplayerStatus;
(function (MultiplayerStatus) {
    MultiplayerStatus[MultiplayerStatus["waitingForGame"] = 0] = "waitingForGame";
    MultiplayerStatus[MultiplayerStatus["inGame"] = 1] = "inGame";
    MultiplayerStatus[MultiplayerStatus["roundComplete"] = 2] = "roundComplete";
    MultiplayerStatus[MultiplayerStatus["retired"] = 3] = "retired";
})(MultiplayerStatus = exports.MultiplayerStatus || (exports.MultiplayerStatus = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["ongoing"] = 0] = "ongoing";
    GameStatus[GameStatus["completed"] = 1] = "completed";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var TournamentStatus;
(function (TournamentStatus) {
    TournamentStatus[TournamentStatus["current"] = 0] = "current";
    TournamentStatus[TournamentStatus["closed"] = 1] = "closed";
    TournamentStatus[TournamentStatus["closedNotScored"] = 2] = "closedNotScored";
})(TournamentStatus = exports.TournamentStatus || (exports.TournamentStatus = {}));
exports.TournamentKeys = [
    "-LaUNT2hnYdLmLn7F8zg",
    "-LfclAFBBlu_PNg8HCc_",
    "-LfclAFcMdLk7BJkXrT1",
    "-LfclAFvWow-ATAIUufM",
    "-LfclAGDcC-X-6UpWpw1",
    "-LfclAGWyhp6E-kJHs2_",
    "-LfclAGnRfxo1K4Sxz7u",
    "-LfclAH3BmjQMdVgru0T",
    "-LfclAHkc33U9M3j9P5J",
    "-LfclAI-8fnBkU3zZvuS",
    "-LfclAIJGJwdMMiWeTBx",
    "-LfclAIaFaH_uNjmfPGg",
    "-LfclAIspJwNp1ug8aDp",
    "-LfclAJ8PPNngZeeTpv8",
    "-LfclAJPBU3AA7lq1En1",
    "-LfclAJfPKgbZUoeNS9U"
];
exports.UncompletedGameScore = 999;
//# sourceMappingURL=constants.js.map