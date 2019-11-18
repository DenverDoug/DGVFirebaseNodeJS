"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultiplayerStatus;
(function (MultiplayerStatus) {
    MultiplayerStatus[MultiplayerStatus["waitingForGame"] = 0] = "waitingForGame";
    MultiplayerStatus[MultiplayerStatus["inGame"] = 1] = "inGame";
    MultiplayerStatus[MultiplayerStatus["roundComplete"] = 2] = "roundComplete";
    MultiplayerStatus[MultiplayerStatus["retired"] = 3] = "retired";
})(MultiplayerStatus = exports.MultiplayerStatus || (exports.MultiplayerStatus = {}));
var MPStatus;
(function (MPStatus) {
    MPStatus[MPStatus["wfg"] = 0] = "wfg";
    MPStatus[MPStatus["ig"] = 1] = "ig";
    MPStatus[MPStatus["rc"] = 2] = "rc";
    MPStatus[MPStatus["r"] = 3] = "r";
})(MPStatus = exports.MPStatus || (exports.MPStatus = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["ongoing"] = 0] = "ongoing";
    GameStatus[GameStatus["completed"] = 1] = "completed";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var MPGameStatus;
(function (MPGameStatus) {
    MPGameStatus[MPGameStatus["o"] = 0] = "o";
    MPGameStatus[MPGameStatus["c"] = 1] = "c";
})(MPGameStatus = exports.MPGameStatus || (exports.MPGameStatus = {}));
var TournamentStatus;
(function (TournamentStatus) {
    TournamentStatus[TournamentStatus["current"] = 0] = "current";
    TournamentStatus[TournamentStatus["closed"] = 1] = "closed";
    TournamentStatus[TournamentStatus["closedNotScored"] = 2] = "closedNotScored";
})(TournamentStatus = exports.TournamentStatus || (exports.TournamentStatus = {}));
exports.TournamentKeys = [
    "-LfclAGnRfxo1K4Sxz7u",
    "-LfclAJPBU3AA7lq1En1",
    "-Lg6xGUimCuPJd_YWe8f",
    "-Lg6xGXCQSwkAaUsMEMQ",
    "-Lg6xGX_9TbqGvKEG6jN",
    "-Lg6xGXl3V621Brii4tT",
    "-Lo0e9OCzhtM4Y_pmmgY",
    "-Lo0e9OOI2lzM2a-D6z4",
    "-Lo0e9O_kcEN6hpRcuxZ",
    "-Lo0e9OiXhZ0YUi8Fz8q",
    "-Lo0e9OsUeuVm8FriobR",
    "-Lo0e9P0ICh4wEuN4BRd",
    "-Lo0e9P9T_RjOppkUNsS",
    "-Lo0e9PHmJeUd5qi57hL",
    "-Lo0e9PQmcB-3klHCF0C",
    "-Lo0e9PZgWSsyqxuJEHb",
    "-Lo0e9Pi_PizLiYLr5xk",
    "-Lo0e9PtcpgibaEWIRn7",
    "-Lo0e9Q2cxjFAm0XL_Pe",
    "-Lo0e9QB1lvUheKaYgF8",
    "-Lo0e9QJ9DIizlJ7b_MN",
    "-Lo0e9QTyHA33PP2P0gp",
    "-Lo0e9Qbeknc6C_vh_5w",
    "-Lo0e9QnUIX_FG1RPXWQ",
    "-Lo0e9QxUGX7HCj7XS2E",
    "-Lo0e9R8xg0P-RfNAEZk",
    "-Lo0e9RJspm7zEQ6EN7p",
    "-Lo0e9RmfRcUqyO1FIcZ",
    "-Lo0e9S1FcQyq7EEglFR",
    "-Lo0e9SAPa8I1v-ZYAjZ",
    "-Lo0e9SKnBWCqXV_CDsL",
    "-Lo0e9SWnSF58t8tAB4F",
    "-Lo0e9Sfp5-KH2-3trAe",
    "-Lo0e9Sna0O8GfEAhmU_",
    "-Lo0e9SwetPe1pNb5GNk",
    "-Lo0e9T4XAH8DoSwGaV6",
    "-Lo0e9TEUzcVwuX1aPeN",
    "-Lo0e9TNdL02TYZJdda4",
    "-Lo0e9TaN4xtKXI3OH91",
    "-Lo0e9TkCseBjK86VtVr",
    "-Lo0e9TvmOSh0ATqNX6q",
    "-Lo0e9U3wdh36ayLAzqa",
    "-Lo0e9UEtN_IVU_T_45v",
    "-Lo0e9UQ4_1DnJdeknE4",
    "-Lo0e9UZc4-uu9fnYroc",
    "-Lo0e9Ui_ALtxcGrXmyX",
    "-Lo0e9UsYkXrKAp48VeP",
    "-Lo0e9V-UfYPOHMCkOdc",
    "-Lo0e9VPyjh7WMXq5SL9",
    "-Lo0e9VZboTM1iU4WvPG",
    "-Lo0e9Vi3qSFPll85us_",
    "-Lo0e9VsThYlxoJ0JOnZ",
    "-Lo0e9W1ozA0uZ62KQ2f",
    "-Lo0e9W9uHQJfC3hvttJ",
    "-Lo0e9WIAh7gaOxf2sQP",
    "-Lo0e9WT_jEXnpF1dsre",
    "-Lo0e9WbNzK6K4dv5qqB",
    "-Lo0e9WnRPRvTMb0q0jw",
    "-Lo0e9WwxWt4dqfHqSJa",
    "-Lo0e9X32qLxEVJjs25O",
    "-Lo0e9XBOJZGGpnMFO8n",
    "-Lo0e9XKAYGEAZKy4psc",
    "-Lo0e9XT0dmLgz2uPVgJ",
    "-Lo0e9XaGO00dxKegXlg",
    "-Lo0e9XkD3YJh7IYRwFb",
    "-Lo0e9Xt2SeGLEOfqxyl",
    "-Lo0e9Y2XJJ6VDvTr46c",
    "-Lo0e9YBQiBHB8sK7PyB",
    "-Lo0e9YSI3IR85pG5mlO",
    "-Lo0e9YwnA2C-mjxK0pc",
    "-Lo0e9Z616Th3dd7L7oQ",
    "-Lo0e9ZFuTKlFpXdwnT-",
    "-Lo0e9ZP4eJLe-qGEfP1",
    "-Lo0e9ZZc7CS8c2fMbIW",
    "-Lo0e9ZkSyhUTAfEcSbO",
    "-Lo0e9ZtJHTKGXAE3H86",
    "-Lo0e9_6c4VIjndTMmtg",
    "-Lo0e9_EIMn3-AO9Wo7q",
    "-Lo0e9_N9iPoR3S9o_rO",
    "-Lo0e9_VeMUpo80XNl0t",
    "-Lo0e9_cj6Dttyaoxe70",
    "-Lo0e9_lNo1IJjriUPPc",
    "-Lo0e9_ufZLNm_SNgV4J",
    "-Lo0e9a2pZGqz2Q-DTRz",
    "-Lo0e9aC5iCduIPKhaCK",
    "-Lo0e9aLcC0MBkJrjhTk",
    "-Lo0e9aWT0iRyPOC6LG3",
    "-Lo0e9aeMnTO5kbDLvCl",
    "-Lo0e9am02nT8_FOFSAt",
    "-Lo0e9awZxLIC-DHwxzN",
    "-Lo0e9bNGvlz4EPXnxPu",
    "-Lo0e9bXau3X4rouc_o8",
    "-Lo0e9biOJ0Khvo32PCD",
    "-Lo0e9bunGJ-1d4bXQgH",
    "-Lo0e9c2wgB484kg5c_k",
    "-Lo0e9cED3os7LqAhpio",
    "-Lo0e9cTYnsyVCaxciO0",
    "-Lo0e9ceijvyeV7AfYmy",
    "-Lo0e9ctoBUB_VZ5xMWK",
    "-Lo0e9d7BlBt0c7Uem8N",
    "-Lo0e9dJPrWChX8z-u8I",
    "-Lo0e9dYhON69H2MC_ms",
    "-Lo0e9eBJE92PII115lh",
    "-Lo0e9eQzMOQDWKHbsAb",
    "-Lo0e9efF0KNjm9p4csT",
    "-Lo0e9etM5_ha6Facf6m",
    "-Lo0n4kqPuY1Z9wPIpo8",
    "-Lo0n4l3Zo15l8_Er8fG",
    "-Lo0n4lEjU9XGNNkdlhO",
    "-Lo0n4lP1hmyOZEiGVlQ",
    "-Lo0n4lYGJT9fzLGEHH4",
    "-Lo0n4lf-P7uS3Un6c23",
    "-Lo0n4lsMaqItwzEiiFw",
    "-Lo0n4m3tC3dQQ9kPgyy",
    "-Lo0n4mEQJGC-xIdGPn3",
    "-Lo0n4mM81MHH2LG9A-E",
    "-Lo0n4mZzpNfTHeecrrZ",
    "-Lo0n4mhflDkQbfUP-VN",
    "-Lo0n4ms3rSLLgoEJ1CA",
    "-Lo0n4n1_c9yj7RGAmbW",
    "-Lo0n4nBoapYVWozJzba",
    "-Lo0n4nLpIJv2cFdY29n",
    "-Lo0n4nURhjGZECGFwXk",
    "-Lo0n4ngqFjmCDq_0Z8R",
    "-Lo0n4nsoVCXWxxlQ16m",
    "-Lo0n4o4lXQ4mKKslY3n"
];
exports.UncompletedGameScore = 999;
//# sourceMappingURL=constants.js.map