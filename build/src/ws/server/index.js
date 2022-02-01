"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userId = exports.createWSS = void 0;
const structs_1 = require("../../lib/structs");
const msg_1 = require("./msg");
const session_1 = require("./session");
const util_1 = require("../../util");
const msgTypeToFn = {
    create: session_1.createSession,
    join: session_1.join,
    guess: session_1.guess,
};
const MAX_CNX = 1000;
function createWSS(port = 8080) {
    const wss = new structs_1.WebSocketServer({
        port,
        backlog: 100,
        maxPayload: 256,
        clientTracking: true,
    });
    const cycle = setInterval(function () {
        wss.clients.forEach((client, i) => {
            if (client.is_alive === false) {
                (0, session_1.remove)(client);
                return;
            }
            client.isAlive = false;
            client.ping();
        });
    }, 30000);
    wss.on('close', function close() {
        clearInterval(cycle);
    });
    wss.on('connection', function (cnx) {
        if (wss.clients.size >= MAX_CNX) {
            (0, msg_1.err)(cnx, 'overload');
            cnx.close();
            return;
        }
        cnx.on('close', function () {
            (0, session_1.remove)(cnx);
        });
        cnx.on('pong', heartbeat);
        cnx.on('message', function (data) {
            let message;
            try {
                message = (0, msg_1.validateMsg)(cnx, data);
            }
            catch (e) {
                return;
            }
            let response;
            try {
                response = msgTypeToFn[message.type](cnx, message);
            }
            catch (e) {
                console.log(message);
                (0, msg_1.err)(cnx, e);
                return;
            }
            (0, msg_1.msg)(cnx, response);
        });
        try {
            cnx.user_id = userId();
        }
        catch (e) {
            (0, msg_1.err)(cnx, e);
            (0, session_1.remove)(cnx);
            return;
        }
        (0, msg_1.msg)(cnx, {
            type: structs_1.MsgType.user_id,
            content: cnx.user_id,
            user_id: cnx.user_id,
        });
    });
    return wss;
}
exports.createWSS = createWSS;
function heartbeat() {
    this.is_alive = true;
    return heartbeat;
}
const nameList = Object.keys(util_1.names);
function userId() {
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    let _nameList = nameList.filter(name => util_1.names[name] === false);
    let name;
    while (!name && attempts++ < MAX_ATTEMPTS) {
        name = (0, util_1.getRand)(_nameList);
        if (util_1.names[name] === false) {
            util_1.names[name] = true;
            return name;
        }
    }
    throw 'no available user id';
}
exports.userId = userId;
