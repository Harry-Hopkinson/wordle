//@/ts-strict
import { WS, WebSocket, Message, MsgType } from '../../lib/structs'
import { validateMsg, msg } from './msg'
export { requestSession } from './session'
import { guess } from './session'
import { display, infoIndex } from '../../cli'

const URL = 'localhost'

const msgTypeToFn = {
  user_id: setUserId,
  session_id: setSessionId,
  info: info,
  error: error,
  guess: guess,
}

function error(ws: any, data: any) {
  console.error('error from server', data)
}

function info(cnx: any, message: Message, color: string = 'green') {
  if (typeof message.content === 'string') {
    display.alterMessage(message.content, color)
    display.print()
  }
}

function setUserId(cnx: WS, message: Message) {
  if (!message || typeof message.content !== 'string') {
    return
  }

  cnx.user_id = message.content
  display.screen.splice(infoIndex(), 0, `user id: ${cnx.user_id}`)
  display.print()
}

let count = 0
function setSessionId(cnx: WS, message: Message) {
  if (cnx.session_id) return
  cnx.session_id = message.session_id

  display.screen.splice(infoIndex() - 1, 0, `session id: ${cnx.session_id}`)
  display.print()
}

export function createWS(url = URL, port = 8080): Promise<WS> {
  return new Promise(keep => {
    const ws : any = new WebSocket(`ws://${url}`)

    ws.on('open', function () {
      console.log('Connection Established with', ws.url)
      keep(ws)
    })

    ws.on('message', function (data: any) {
      let message: { type: string | number }
      try {
        message = validateMsg(ws, data)
      } catch (e) {
        return
      }

      try {
        msgTypeToFn[message.type](ws, message)
      } catch (e) {
        console.error('action error', message, e)
      }
    })

    ws.on('error', function (data: any) {
      console.error('received: %s', data)
      return
    })

    ws.on('close', function (data: any) {
      console.log('goodbye')
      process.exit(0)
    })
  })
}