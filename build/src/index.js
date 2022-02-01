"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCorrect = exports.updateAlphabet = exports.evaluateGuess = exports.validateResponse = exports.wordToRow = void 0;
const structs_1 = require("./lib/structs");
const util_1 = require("./util");
function wordToRow(word) {
    return word.split('').map(letter => ({
        letter,
        visibility: structs_1.Visibility.hidden,
    }));
}
exports.wordToRow = wordToRow;
function validateResponse(response) {
    if (!response.content || typeof response.content !== 'string') {
        throw 'bad guess';
    }
    else if (/[^a-z]/i.test(response.content)) {
        throw 'only a-zA-Z';
    }
    else if (response.content.length !== 5) {
        throw '5 letters only';
    }
    else if (!util_1.words[response.content.toLocaleLowerCase()]) {
        throw 'not in wordlist';
    }
}
exports.validateResponse = validateResponse;
function evaluateGuess(guess, answer) {
    guess.forEach((option, i) => {
        const oL = option.letter.toLocaleLowerCase();
        const aL = answer[i].letter.toLocaleLowerCase();
        if (oL === aL) {
            option.visibility = structs_1.Visibility.revealed;
        }
        else if (letterExists(guess, i, answer)) {
            option.visibility = structs_1.Visibility.exists;
        }
        else {
            option.visibility = structs_1.Visibility.guessed;
        }
        if (util_1.letters[oL] !== structs_1.Visibility.revealed)
            util_1.letters[oL] = option.visibility;
    });
}
exports.evaluateGuess = evaluateGuess;
function updateAlphabet(guess) {
    guess.forEach((option, i) => {
        const oL = option.letter.toLocaleLowerCase();
        if (util_1.letters[oL] !== structs_1.Visibility.revealed) {
            util_1.letters[oL] = option.visibility;
        }
    });
}
exports.updateAlphabet = updateAlphabet;
function letterExists(guess, i, answer) {
    const option = guess[i];
    if (!answer.find(l => l.letter === option.letter)) {
        return false;
    }
    function sameLetterIndices(row) {
        return row.slice().reduce((a, v, j) => {
            if (v.letter === option.letter) {
                a.push(j);
            }
            return a;
        }, []);
    }
    const sameAnswerLetterIndices = sameLetterIndices(answer);
    const sameGuessLetterIndices = sameLetterIndices(guess);
    const intersection = sameAnswerLetterIndices.filter(i => !sameGuessLetterIndices.includes(i));
    sameGuessLetterIndices.forEach(i => {
        if (guess[i].visibility === structs_1.Visibility.exists) {
            intersection.shift();
        }
    });
    if (intersection.length) {
        return true;
    }
    return false;
}
function isCorrect(guess) {
    if (guess.some(letter => letter.visibility !== structs_1.Visibility.revealed)) {
        return false;
    }
    return true;
}
exports.isCorrect = isCorrect;
