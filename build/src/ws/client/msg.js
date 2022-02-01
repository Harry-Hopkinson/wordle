"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMsg = exports.msg = void 0;
const structs_1 = require("../../lib/structs");
function msg(cnx, m) {
    cnx.send(JSON.stringify(m));
}
exports.msg = msg;
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
