"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgType = exports.WebSocket = exports.WebSocketServer = void 0;
const ws = require("ws");
exports.WebSocketServer = ws.WebSocketServer;
exports.WebSocket = ws.WebSocket;
var MsgType;
(function (MsgType) {
    MsgType["user_id"] = "user_id";
    MsgType["session_id"] = "session_id";
    MsgType["info"] = "info";
    MsgType["create"] = "create";
    MsgType["join"] = "join";
    MsgType["guess"] = "guess";
    MsgType["error"] = "error";
})(MsgType = exports.MsgType || (exports.MsgType = {}));
