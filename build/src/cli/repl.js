"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repl = exports.question = void 0;
const readline = require("readline");
const structs_1 = require("../lib/structs");
require("./args");
const __1 = require("../");
const printer_1 = require("./printer");
const msg_1 = require("../ws/client/msg");
const util_1 = require("../util");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.on('close', function () {
    process.exit(0);
});
async function question(query) {
    return new Promise(keep => {
        rl.question(query, function (answer) {
            keep(answer);
        });
    });
}
exports.question = question;
const wordList = Object.keys(util_1.words);
async function repl(cnx = undefined) {
    let answer;
    if (!cnx) {
        let filteredWordList = wordList.filter(word => word.length === 5);
        answer = (0, __1.wordToRow)((0, util_1.getRand)(filteredWordList));
    }
    const guesses = [];
    let guess = (0, __1.wordToRow)('     ');
    while (!(0, __1.isCorrect)(guess)) {
        printer_1.display.print();
        let response;
        try {
            response = await question('');
            (0, __1.validateResponse)({ type: structs_1.MsgType.guess, content: response });
        }
        catch (e) {
            printer_1.display.alterMessage(e);
            continue;
        }
        guess = (0, __1.wordToRow)(response);
        if (cnx) {
            (0, msg_1.msg)(cnx, {
                type: structs_1.MsgType.guess,
                content: response,
                user_id: cnx.user_id,
                session_id: cnx.session_id,
            });
            continue;
        }
        (0, __1.evaluateGuess)(guess, answer);
        guesses.push(guess);
        printer_1.display.addToGuesses(guess);
    }
    printer_1.display.print();
    console.log('CORRECT!');
    process.exit(0);
}
exports.repl = repl;
