"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guess = exports.join = exports.sessions = exports.createSession = exports.remove = exports.Session = void 0;
//@/ts-strict
const structs_1 = require("../../lib/structs");
const __1 = require("../../");
const args_1 = require("../../cli/args");
const msg_1 = require("./msg");
const util_1 = require("../../util");
class Session {
    constructor(session_id) {
        this.session_id = session_id;
        this.guests = [];
        this.answer = 'ibudi';
        this.guesses = [];
    }
}
exports.Session = Session;
function remove(ws) {
    console.log(`removing ${ws.user_id} from ${ws.session_id}`);
    const userSession = exports.sessions[ws.session_id];
    if (userSession && userSession.guests) {
        userSession.guests.splice(userSession.guests.findIndex(guest => guest.id === ws.user_id), 1);
    }
    if (userSession && userSession.guests.length === 0) {
        delete exports.sessions[ws.session_id];
    }
    if (util_1.names[ws.user_id]) {
        util_1.names[ws.user_id] = false;
    }
    if (ws.readyState < 2) {
        ws.terminate();
    }
}
exports.remove = remove;
function createSession(ws, message) {
    let session_id;
    try {
        session_id = sessionId();
    }
    catch (e) {
        (0, msg_1.err)(ws, 'no session_id available', true);
        return;
    }
    const answer = selectAnswer(5);
    exports.sessions[session_id].answer = answer;
    console.log('sess id:', session_id, '  answer:', answer);
    const response = {
        type: structs_1.MsgType.session_id,
        user_id: ws.user_id,
        content: session_id,
        session_id,
    };
    join(ws, response);
}
exports.createSession = createSession;
const wordList = Object.keys(util_1.words);
exports.sessions = {};
function sessionId() {
    let id;
    let tries = 0;
    const MAX_TRIES = 10;
    while (!id && tries++ < MAX_TRIES) {
        id = [(0, util_1.getRand)(wordList), '-', (0, util_1.getRand)(wordList)].join('');
        if (!exports.sessions[id]) {
            exports.sessions[id] = new Session(id);
            return id;
        }
        id = undefined;
    }
    throw 'no session available';
}
function selectAnswer(length = 5) {
    const filteredWordList = wordList.filter(word => word.length === length);
    return (0, util_1.getRand)(filteredWordList);
}
function join(ws, message) {
    if (!message || !message.session_id || !exports.sessions[message.session_id]) {
        (0, msg_1.err)(ws, `no such session id ${message.session_id}`, true);
        return;
    }
    const response = {
        type: structs_1.MsgType.session_id,
        user_id: message.user_id,
    };
    const userSession = Object.values(exports.sessions).find((session) => session.guests.find(guest => guest.id === message.user_id));
    if (!userSession) {
        exports.sessions[message.session_id].guests.push({ id: ws.user_id });
        response.session_id = message.session_id;
    }
    else {
        response.session_id = userSession.session_id;
    }
    ws.session_id = message.session_id;
    (0, msg_1.msg)(ws, response);
    exports.sessions[message.session_id].guesses.forEach(guess => {
        (0, msg_1.msg)(ws, { type: structs_1.MsgType.guess, content: guess });
    });
}
exports.join = join;
function guess(ws, message) {
    try {
        (0, __1.validateResponse)(message);
    }
    catch (e) {
        (0, msg_1.err)(ws, e, true);
        return;
    }
    if (!message.session_id) {
        (0, msg_1.err)(ws, 'no session_id', true);
        return;
    }
    const session = exports.sessions[message.session_id];
    if (!session) {
        (0, msg_1.err)(ws, 'no such session_id', true);
        return;
    }
    const MAX_GUESSES = 20;
    if (session.guesses.length >= MAX_GUESSES) {
        endSession(ws, 'no more guesses');
        return;
    }
    let guess = (0, __1.wordToRow)(message.content);
    (0, __1.evaluateGuess)(guess, (0, __1.wordToRow)(session.answer));
    session.guesses.push(guess);
    const sessionGuests = [];
    args_1.wss.clients.forEach((client) => {
        if (session.guests.find(guest => {
            return guest.id === client.user_id;
        })) {
            sessionGuests.push(client);
        }
    });
    message.content = guess;
    const correct = (0, __1.isCorrect)(guess);
    sessionGuests.forEach((guest, i) => {
        (0, msg_1.msg)(guest, message);
        if (correct) {
            const winMsg = {
                ...message,
                type: structs_1.MsgType.info,
                content: `correct! winner: ${ws.user_id}`,
            };
            (0, msg_1.msg)(guest, winMsg);
            remove(guest);
        }
    });
}
exports.guess = guess;
function endSession(cnx, message) {
    const session = exports.sessions[cnx.session_id];
    if (!session) {
        (0, msg_1.err)(cnx, message, true);
        remove(cnx);
        return;
    }
    session.guests.forEach(guest => {
        (0, msg_1.err)(guest, message, true);
        remove(guest);
    });
}
