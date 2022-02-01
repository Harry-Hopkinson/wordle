"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guess = exports.requestSession = void 0;
const structs_1 = require("../../lib/structs");
const _1 = require("./");
const __1 = require("../../");
const printer_1 = require("../../cli/printer");
const msg_1 = require("./msg");
async function requestSession(address, session_id) {
    const ws = await (0, _1.createWS)(address);
    if (!session_id) {
        (0, msg_1.msg)(ws, { type: structs_1.MsgType.create, user_id: ws.user_id });
    }
    else {
        (0, msg_1.msg)(ws, { type: structs_1.MsgType.join, user_id: ws.user_id, session_id });
    }
    return ws;
}
exports.requestSession = requestSession;
function guess(cnx, message) {
    (0, __1.updateAlphabet)(message.content);
    printer_1.display.addToGuesses(message.content);
    printer_1.display.print();
}
exports.guess = guess;
