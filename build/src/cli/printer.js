"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoIndex = exports.display = void 0;
const chalk = require("chalk");
const util_1 = require("../util/");
class Display {
    constructor() {
        this.screen = [
            'welcome to terminordle',
            `>> ${' '.repeat(20)} <<`,
            (0, util_1.typesetAlphabet)(),
        ];
        this.offBy = 0;
    }
    addToGuesses(guess) {
        this.screen.splice(infoIndex() + 1, 1, (0, util_1.typesetAlphabet)());
        this.screen.push((0, util_1.typesetGuess)(guess));
        this.alterMessage();
        this.offBy = 0;
    }
    alterMessage(message = '', color = 'redBright') {
        this.screen[this.screen.findIndex(line => /^>>/.test(line))] = `>> ${chalk[color](message)}${' '.repeat(Math.max(21 - message.length, 0))}<<`;
        this.offBy = 1;
    }
    print() {
        process.stdout.moveCursor(0, -1 * (this.screen.length + this.offBy));
        process.stdout.clearScreenDown();
        this.screen.forEach(line => process.stdout.write(line + '\n'));
    }
}
exports.display = new Display();
function infoIndex() {
    return exports.display.screen.findIndex(line => /^>>/.test(line));
}
exports.infoIndex = infoIndex;
