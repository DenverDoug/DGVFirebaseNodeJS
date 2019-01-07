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
    "-LV-QWTz-Q1F0B7HHx5w",
    "-LVTGODV5Ae_WM9tcnxF",
    "-LVTGOE1XmCnrpJFRHxF",
    "-LVTGOEOMKkEZ_Tc8ZX-",
    "-LVTGOEZS-ho58djkSmd",
    "-LVTGOEkj9SKDbvoCODA",
    "-LVTGdLQbuJ1KJ5yEBKr",
    "-LVTGdLn6V9HcDVtX6VP",
    "-LVTGdM267PWdim3lXBA",
    "-LVTGdMPpaOQLoOXoaDh",
    "-LVTGdMdSdAzsKcVPtvB",
    "-LVTGdMpu_JWOG4ZIzR0",
    "-LVTGdMzo3Xihx_Wug3z",
    "-LVTGdNBXnARtglvfBWl",
    "-LVTGdNcVr7YVdPSB8Ao",
    "-LVTGdNomumRJOHCVJya",
    "-LVTGdNx4deaCWLbYlDq",
    "-LVTGdO9o10FHanNbMdz",
    "-LVTGdOKtJbGtIFAsXSq",
    "-LVTGdOUznFenYF0gwbH",
    "-LVTGdOfN1vtWayi-fgt",
    "-LVTGdOsu3hEV2xHZ9GT",
    "-LVTGdPBL7_35cHxgKtr",
    "-LVTGdPMNMdHYjpI5Lki",
    "-LVTGdPWp0WdyJhClRYO",
    "-LVTGdPl-ucNNjB_Aqq8",
    "-LVTGdPxOejoJxNzMqD4",
    "-LVTGdQ66dzMbf5wnFGc",
    "-LVTGdQR6SvM9AXz9MEI",
    "-LVTGdQt_stn3Y08gXGi"
];
exports.UncompletedGameScore = 999;
//# sourceMappingURL=constants.js.map