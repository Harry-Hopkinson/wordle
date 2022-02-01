"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMsg = exports.err = exports.msg = void 0;
const chalk = require("chalk");
const structs_1 = require("../../lib/structs");
function msg(cnx, m) {
    cnx.send(JSON.stringify(m));
}
exports.msg = msg;
function err(cnx, e, send = false) {
    console.error(chalk.chalkStderr.redBright(cnx.user_id, cnx.session_id, e));
    send && msg(cnx, { type: structs_1.MsgType.error, content: e });
}
exports.err = err;
function validateMsg(cnx, data) {
    try {
        data = JSON.parse(data);
    }
    catch (e) {
        throw 'bad json';
    }
    if (!data.type || !(data.type in structs_1.MsgType)) {
        throw `bad message type ${data.type}`;
    }
    return data;
}
exports.validateMsg = validateMsg;
