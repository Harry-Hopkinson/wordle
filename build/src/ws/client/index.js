"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWS = exports.requestSession = void 0;
//@/ts-strict
const structs_1 = require("../../lib/structs");
const msg_1 = require("./msg");
var session_1 = require("./session");
Object.defineProperty(exports, "requestSession", { enumerable: true, get: function () { return session_1.requestSession; } });
const session_2 = require("./session");
const cli_1 = require("../../cli");
const URL = 'localhost';
const msgTypeToFn = {
    user_id: setUserId,
    session_id: setSessionId,
    info: info,
    error: error,
    guess: session_2.guess,
};
function error(ws, data) {
    console.error('error from server', data);
}
function info(cnx, message, color = 'green') {
    if (typeof message.content === 'string') {
        cli_1.display.alterMessage(message.content, color);
        cli_1.display.print();
    }
}
function setUserId(cnx, message) {
    if (!message || typeof message.content !== 'string') {
        return;
    }
    cnx.user_id = message.content;
    cli_1.display.screen.splice((0, cli_1.infoIndex)(), 0, `user id: ${cnx.user_id}`);
    cli_1.display.print();
}
let count = 0;
function setSessionId(cnx, message) {
    if (cnx.session_id)
        return;
    cnx.session_id = message.session_id;
    cli_1.display.screen.splice((0, cli_1.infoIndex)() - 1, 0, `session id: ${cnx.session_id}`);
    cli_1.display.print();
}
function createWS(url = URL, port = 8080) {
    return new Promise(keep => {
        const ws = new structs_1.WebSocket(`ws://${url}`);
        ws.on('open', function () {
            console.log('Connection Established with', ws.url);
            keep(ws);
        });
        ws.on('message', function (data) {
            let message;
            try {
                message = (0, msg_1.validateMsg)(ws, data);
            }
            catch (e) {
                return;
            }
            try {
                msgTypeToFn[message.type](ws, message);
            }
            catch (e) {
                console.error('action error', message, e);
            }
        });
        ws.on('error', function (data) {
            console.error('received: %s', data);
            return;
        });
        ws.on('close', function (data) {
            console.log('goodbye');
            process.exit(0);
        });
    });
}
exports.createWS = createWS;
