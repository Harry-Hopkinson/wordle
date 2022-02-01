"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typesetAlphabet = exports.typesetGuess = void 0;
const chalk = require("chalk");
const structs_1 = require("../lib/structs");
const _1 = require("./");
const optColorMap = {
    [structs_1.Visibility.hidden]: chalk.chalkStderr.bgWhite,
    [structs_1.Visibility.guessed]: chalk.chalkStderr.bgGray,
    [structs_1.Visibility.exists]: chalk.chalkStderr.bgYellow,
    [structs_1.Visibility.revealed]: chalk.chalkStderr.bgGreenBright,
};
function typesetGuess(guess) {
    return guess
        .map((option) => {
        return optColorMap[option.visibility](option.letter);
    })
        .join('');
}
exports.typesetGuess = typesetGuess;
function typesetAlphabet() {
    return Object.entries(_1.letters)
        .map(([k, v]) => {
        return optColorMap[v](k);
    })
        .join('');
}
exports.typesetAlphabet = typesetAlphabet;
