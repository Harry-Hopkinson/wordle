import * as process from 'process'

export { display, infoIndex } from './printer'
export { repl } from './repl'
import './args'

export function setSignals(cnx) {
  process.stdin.resume()
  process.on('SIGINT', handleSig)
  process.on('SIGBREAK', handleSig)
}

function handleSig(cnx) {
  console.log('closing connection')
  cnx.terminate()
}