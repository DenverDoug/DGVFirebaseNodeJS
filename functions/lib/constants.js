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
    "-LXSz-rOlBLFrzpNxHUO",
    "-LaUNT0YpzNio_sJMnjT",
    "-LaUNT0jh4WBIXRkvZEO",
    "-LaUNT0uSdUXSXjCiLiA",
    "-LaUNT16gGr1GAxKTpM-",
    "-LaUNT1IHkblcLIFkzGA",
    "-LaUNT1S4Lro3WkMMLV1",
    "-LaUNT1bfPUjbtvbGUEg",
    "-LaUNT1pvxZM1SPh-fwu",
    "-LaUNT21J8Fw4-cvF_4D",
    "-LaUNT29qZdr2dta5At6",
    "-LaUNT2KwNJtwn0-SZQS",
    "-LaUNT2UczXGqJQKrKWT",
    "-LaUNT2hnYdLmLn7F8zg",
    "-LaUNT2wfizSY4lH7BD3",
    "-LaUNT365ckmjYEbrp5N",
    "-LaUNT3T8fC5lHCUzq_6",
    "-LaUNT3dJxmlZDLbJ_E9",
    "-LaUNT3na0NgtNpqcaJs",
    "-LaUNT3yreVpyj4F1cSm",
    "-LaUNT4AlS1cUT2ZQ2Vk",
    "-LaUNT4RuV_a0jUhdtut",
    "-LaUNT4diVd_Vz6xYavQ",
    "-LaUNT4mLBL9YjSo9kvT",
    "-LaUNT4x8TEI8k7rY8uy",
    "-LaUNT57pS2RwXBIZ8Fo",
    "-LaUNT5INJ9tR5jx_9R0",
    "-LaUNT5WjoonT2sBHNK4",
    "-LaUNT5gf0rbZctzCPuo",
    "-LaUNT5p_DQSOxOe01g7",
    "-LaUNT6-hOoVG2X-z4CQ",
    "-LaUNT6CD6OxGSoJt-CF",
    "-LaUNT6NcPnKye3dJjt9",
    "-LaUNT6pnNh9suoV--EG",
    "-LaUNT6zYROYCMDhBZsr",
    "-LaUNT7AFC0J-Z5TDD8s",
    "-LaUNT7KjeRzAgFcAWlX",
    "-LaUNT7YGVQxWByDVqtf",
    "-LaUNT7ktUURtk2JHWoY",
    "-LaUNT7vvEWUJEfiQT2V",
    "-LaUNT8778x0FvMtkk4g",
    "-LaUNT8JBojQSRFkgr0G",
    "-LaUNT8XeTuG9AEPRzIk",
    "-LaUNT8mm13M8vnA8pIU",
    "-LaUNT9-VFFzDIoF6gLm",
    "-LaUNT9B-5i_VfFCVydQ",
    "-LaUNT9ONtak3q7pAPku",
    "-LaUNT9auFB7A2c5fGL2",
    "-LaUNT9kCDeT_4zWbpbK",
    "-LaUNTA7h2AFYWb_KnfE",
    "-LaUNTALT61RLXk5XXYp"
];
exports.UncompletedGameScore = 999;
//# sourceMappingURL=constants.js.map