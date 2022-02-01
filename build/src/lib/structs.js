"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visibility = exports.MsgType = exports.WebSocketServer = exports.WebSocket = void 0;
var net_1 = require("./net");
Object.defineProperty(exports, "WebSocket", { enumerable: true, get: function () { return net_1.WebSocket; } });
Object.defineProperty(exports, "WebSocketServer", { enumerable: true, get: function () { return net_1.WebSocketServer; } });
Object.defineProperty(exports, "MsgType", { enumerable: true, get: function () { return net_1.MsgType; } });
var Visibility;
(function (Visibility) {
    Visibility["hidden"] = "hidden";
    Visibility["guessed"] = "guessed";
    Visibility["exists"] = "exists";
    Visibility["revealed"] = "revealed";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
