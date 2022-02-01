"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSignals = exports.repl = exports.infoIndex = exports.display = void 0;
const process = require("process");
var printer_1 = require("./printer");
Object.defineProperty(exports, "display", { enumerable: true, get: function () { return printer_1.display; } });
Object.defineProperty(exports, "infoIndex", { enumerable: true, get: function () { return printer_1.infoIndex; } });
var repl_1 = require("./repl");
Object.defineProperty(exports, "repl", { enumerable: true, get: function () { return repl_1.repl; } });
require("./args");
function setSignals(cnx) {
    process.stdin.resume();
    process.on('SIGINT', handleSig);
    process.on('SIGBREAK', handleSig);
}
exports.setSignals = setSignals;
function handleSig(cnx) {
    console.log('closing connection');
    cnx.terminate();
}
