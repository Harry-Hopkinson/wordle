"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
const commander_1 = require("commander");
const chalk = require("chalk");
const ws_1 = require("../ws");
const cli_1 = require("../cli");
const package_json_1 = require("../../package.json");
const program = new commander_1.Command();
program.version(package_json_1.version);
program
    .command('play')
    .description(`${b `play`} terminordle locally`)
    .action(async () => {
    setTimeout(async () => {
        await (0, cli_1.repl)();
    }, 0);
});
program
    .command('join <address>')
    .option('-s, --session <session_id>', 'join session with id')
    .description(`${b `join`} ${y `s session_id`} or leave blank to create new`)
    .action(async (address, options) => {
    const cnx = await (0, ws_1.requestSession)(address, options.session);
    (0, cli_1.setSignals)(cnx);
    await (0, cli_1.repl)(cnx);
});
program
    .command('serve [port]')
    .description(`${b `serve`} terminordle on ${y `[port]`}`)
    .action((port = 8080) => {
    exports.wss = (0, ws_1.createWSS)(port);
    console.log('serving...', exports.wss.address());
});
program.parse(process.argv);
function b(txt) {
    return chalk.chalkStderr.blueBright(txt);
}
function y(txt) {
    return chalk.chalkStderr.yellowBright(txt);
}
