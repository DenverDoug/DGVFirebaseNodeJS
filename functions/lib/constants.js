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
    '-LTsJVeEn-umwvAt-QE4',
    '-LTsJWVPFs9YyiGmTlY9',
    '-LTsJX4LiQNfBCMbs8TL',
    '-LTsJXhJ33uNBqCk4H_c',
    '-LTsJYIzmqkwrQb1Sj2V',
    '-LUEuZBIYxbb0Ak1OnE0',
    '-LUEubFTVjBfPsuPOAJV',
    '-LUEuhFp33SKXGXLAfPV',
    '-LV-QUKKISRZA0od9xUn',
    '-LV-QV6LrF1bp4bBRlh3',
    '-LV-QVneg1tda6_JiIxr',
    '-LV-QWTz-Q1F0B7HHx5w',
    '-LV-QX2ocBVRI4NXjMs7',
    '-LV-QY6e6911M94ZH9aO',
    '-LV-QYj12L9FdQliwx0P',
    '-LV-QZSFa80cvQ7cYt8q',
    '-LV-Q_6e84v7rXdS_6Nw',
    '-LV-Q_lmu6sJa8B88cQD',
    '-LV-XtM_BmTtwxc9SpwC',
    '-LV-XtMdLgPMo_YfCJaz',
    '-LV-Yjihu9abEZaXl3Q_',
    '-LV-Yob-dDlHBXbRhgP9',
    '-LV-YwJTUsduYexVu5Ny',
    '-LV-YxWHftQoxs0dfThx',
    '-LV-Yz6NkcjlM1wCkQ6L',
    '-LV-Z-bwvfy56vfYqnaH',
    '-LV-Z0fJ6mUoflU09f8v',
    '-LV-Z1bnvA7r89CEm3tG',
    '-LV-Z2csuvWjm96x0Re_'
];
exports.UncompletedGameScore = 999;
//# sourceMappingURL=constants.js.map