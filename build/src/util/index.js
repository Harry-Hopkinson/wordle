"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRand = exports.letters = exports.alphabet = exports.words = exports.names = exports.typesetAlphabet = exports.typesetGuess = void 0;
const fs = require("fs");
const structs_1 = require("../lib/structs");
var typeset_1 = require("./typeset");
Object.defineProperty(exports, "typesetGuess", { enumerable: true, get: function () { return typeset_1.typesetGuess; } });
Object.defineProperty(exports, "typesetAlphabet", { enumerable: true, get: function () { return typeset_1.typesetAlphabet; } });
var names_1 = require("./data/names");
Object.defineProperty(exports, "names", { enumerable: true, get: function () { return names_1.names; } });
const file = fs.readFileSync('./src/util/data/wordlist-5_5K.txt', 'utf8');
exports.words = file
    .split('\n')
    .reduce((a, v, i) => ((a[v.toLocaleLowerCase()] = true), a), {});
exports.alphabet = Array.from(Array(26)).map((v, i) => String.fromCharCode(i + 97));
exports.letters = exports.alphabet.reduce((a, v) => {
    a[v] = structs_1.Visibility.hidden;
    return a;
}, {});
function getRand(from) {
    return from[Math.floor(Math.random() * (from.length + 1))];
}
exports.getRand = getRand;
