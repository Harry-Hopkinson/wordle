import { Command } from 'commander'
import * as chalk from 'chalk'

import { createWSS, requestSession } from '../ws'
import { setSignals, repl } from '../cli'
import { version } from '../../package.json'

const program = new Command()
program.version(version)

program
  .command('play')
  .description(`${b`play`} terminordle locally`)
  .action(async () => {
    setTimeout(async () => {
      await repl()
    }, 0)
  })

program
  .command('join <address>')
  .option('-s, --session <session_id>', 'join session with id')
  .description(`${b`join`} ${y`s session_id`} or leave blank to create new`)
  .action(async (address, options) => {
    const cnx = await requestSession(address, options.session)
    setSignals(cnx)
    await repl(cnx)
  })

export let wss
program
  .command('serve [port]')
  .description(`${b`serve`} terminordle on ${y`[port]`}`)
  .action((port = 8080) => {
    wss = createWSS(port)
    console.log('serving...', wss.address())
  })

program.parse(process.argv)

function b(txt) {
  return chalk.chalkStderr.blueBright(txt)
}
function y(txt) {
  return chalk.chalkStderr.yellowBright(txt)
}