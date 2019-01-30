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
    "-LVTGdPl-ucNNjB_Aqq8",
    "-LXSz-de06rrPFBtMDNy",
    "-LXSz-dqeYTHsp2Qkhx1",
    "-LXSz-dzGbSiVFxviyxV",
    "-LXSz-eAm58l-mBYlp_6",
    "-LXSz-eLjc2KwbJJ8o_n",
    "-LXSz-egmSO6FREgayUm",
    "-LXSz-esfGQyVPFR0Lzr",
    "-LXSz-f0Ccy5ecMyVLyX",
    "-LXSz-fBO4HJ_sVl7Fdf",
    "-LXSz-fMBLojY8lRTWtb",
    "-LXSz-fVT70xbWGKIs_P",
    "-LXSz-ff6wq7pDjwzIuJ",
    "-LXSz-fonbPL_X3rAfqS",
    "-LXSz-fzqX8ayIMIlPbb",
    "-LXSz-gAIcbFmxcADh8z",
    "-LXSz-gT5uklohER4OGH",
    "-LXSz-h-37xfvaXO-n2w",
    "-LXSz-hEvn4D2fE8O9V3",
    "-LXSz-hVYaU29AWuLJBe",
    "-LXSz-hvzwEb9jyIrnq-",
    "-LXSz-i9c-OP97ttct6J",
    "-LXSz-iV6UDpG8_abQD5",
    "-LXSz-ioQbydABBjkTQ9",
    "-LXSz-j2l6jCQH04pvVf",
    "-LXSz-jKV81hCEOClHyX",
    "-LXSz-jW9EhQhMYd2329",
    "-LXSz-jnOMAJO8GV6H71",
    "-LXSz-kJ9UXW3DNT7C2A",
    "-LXSz-kW_aNSMrbQ5sIq",
    "-LXSz-kh34nc0TPs6fGC",
    "-LXSz-l0p1ZpgZ0BJ-jn",
    "-LXSz-leko7FegwHAfSz",
    "-LXSz-lyPjSdmA2tJ9bK",
    "-LXSz-mNHmjWq6W2K-sC",
    "-LXSz-meK9CPjz18_ZPx",
    "-LXSz-n06MO8wpT_Bnxr",
    "-LXSz-nGxPQ29OdOrFJc",
    "-LXSz-nkxd8J7SkiMmPT",
    "-LXSz-nwiN6VWH-XBKSK",
    "-LXSz-o7YzzAu04q2lAH",
    "-LXSz-oKf9Si2EVA-xJm",
    "-LXSz-oYG8r_ElQbBok7",
    "-LXSz-omTZnLgYPxBooM",
    "-LXSz-owoHUxpHJaeCuk",
    "-LXSz-pB8VbGKY5qPKFU",
    "-LXSz-pXQ8TRXMaRKVkx",
    "-LXSz-phHSmuU8SGe1BA",
    "-LXSz-qCw8bcixxT0zXf",
    "-LXSz-r1ns3IaSQdjdyr",
    "-LXSz-rOlBLFrzpNxHUO",
    "-LXSz-rmjyiMXGvHv55b",
    "-LXSz-s549eBbYRH9kqW",
    "-LXSz-sJahb198iVNeZc",
    "-LXSz-s_i35Sigve5j9h",
    "-LXSz-skJclOqCEy6Ckp",
    "-LXSz-szes6mNaDPa0SX",
    "-LXSz-tGRyZToAQrXuiX",
    "-LXSz-tSMKdAQ_WWIFnp",
    "-LXSz-tfZ7HUVj5H9Dws",
    "-LXSz-uEdl8vltIj9_Q2",
    "-LXSz-uQw2z-VwEB9jtf",
    "-LXSz-uetvLmnQN7NkXe",
    "-LXSz-v6QajOx2eyhEYR",
    "-LXSz-vLk5mDzkhtrS0q",
    "-LXSz-vZYVwjCHeAWJZu",
    "-LXSz-vhBqD63vydMt0h",
    "-LXSz-vuc98b2cmxZtqR",
    "-LXSz-w75vlQZMvQWs07",
    "-LXSz-wTWapwUMTdTE52",
    "-LXSz-wu717tWbKHzl-8",
    "-LXSz-x28X4-yaAj7-5S",
    "-LXSz-xFmqSBQCyroiIW",
    "-LXSz-xVE0tuXj7j_fmx",
    "-LXSz-xiHTes2Mu6wf5f",
    "-LXSz-xu88rmn7KPEYkx",
    "-LXSz-yFgGCOsLr62Vtx",
    "-LXSz-ybY4oSnA_ZuDkN",
    "-LXSz-z0sLwRLMijhgBl",
    "-LXSz-zH8WEanzbcFtEi",
    "-LXSz-znJsb2yA1SVoWW",
    "-LXSz0-POPkfm9Eqt1IH",
    "-LXSz0-rvylvb67y5C7S",
    "-LXSz00DkekWeiGK-hBN",
    "-LXSz00SDvq5eOpG_J7z",
    "-LXSz00jP6qNfXQBHHv6",
    "-LXSz011OhA9lxGClNgf",
    "-LXSz01GG1IhNrsQXk6Y",
    "-LXSz01bsseSH-5w-igw",
    "-LXSz01yCeUb2uD1PA6c",
    "-LXSz02iEinQPU_cacHt",
    "-LXSz03aIovlHkeXKMUh",
    "-LXSz03wMFNbX37gk0DY",
    "-LXSz04NCfXW73L_NaJD",
    "-LXSz04pySkeV_IrE428",
    "-LXSz0535y4WU_7G_NYb",
    "-LXSz05IC8OG0uKlw9d4",
    "-LXSz05ZJTBAiLJ6bNQ9",
    "-LXSz05qyo4nS1cat8RM",
    "-LXSz062B0qJkHCwJzC0",
    "-LXSz06CNxYE2QzoiDHB"
];
exports.UncompletedGameScore = 999;
//# sourceMappingURL=constants.js.map