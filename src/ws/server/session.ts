//@/ts-strict
import {
    WebSocketServer,
    WS,
    Message,
    MsgType,
    User,
    Row,
  } from '../../lib/structs'
  import { wordToRow, validateResponse, evaluateGuess, isCorrect } from '../../'
  import { wss } from '../../cli/args'
  import { validateMsg, msg, err } from './msg'
  import { getRand, names, words } from '../../util'
  
  export class Session {
    session_id: string
    guests: User[]
    answer: string
    guesses: Row[]
    constructor(session_id: string) {
      this.session_id = session_id
      this.guests = []
      this.answer = 'ibudi'
      this.guesses = []
    }
  }
  
  export function remove(ws) {
    console.log(`removing ${ws.user_id} from ${ws.session_id}`)
    const userSession = sessions[ws.session_id]
  
    if (userSession && userSession.guests) {
      userSession.guests.splice(
        userSession.guests.findIndex(guest => guest.id === ws.user_id),
        1,
      )
    }
  
    if (userSession && userSession.guests.length === 0) {
      delete sessions[ws.session_id]
    }
  
    if (names[ws.user_id]) {
      names[ws.user_id] = false
    }
  
    if (ws.readyState < 2) {
      ws.terminate()
    }
  }
  
  export function createSession(ws: WS, message: Message) {
    let session_id: string
    try {
      session_id = sessionId()
    } catch (e) {
      err(ws, 'no session_id available', true)
      return
    }
  
    const answer = selectAnswer(5)
    sessions[session_id].answer = answer
    console.log('sess id:', session_id, '  answer:', answer)
  
    const response = {
      type: MsgType.session_id,
      user_id: ws.user_id,
      content: session_id,
      session_id,
    }
  
    join(ws, response)
  }
  
  const wordList = Object.keys(words)
  export const sessions: { [key: string]: Session } = {}
  
  function sessionId(): string {
    let id
    let tries = 0
    const MAX_TRIES = 10
    while (!id && tries++ < MAX_TRIES) {
      id = [getRand(wordList), '-', getRand(wordList)].join('')
      if (!sessions[id]) {
        sessions[id] = new Session(id)
  
        return id
      }
      id = undefined
    }
  
    throw 'no session available'
  }
  
  function selectAnswer(length: number = 5) {
    const filteredWordList = wordList.filter(word => word.length === length)
    return getRand(filteredWordList)
  }
  
  export function join(ws: WS, message: Message) {
    if (!message || !message.session_id || !sessions[message.session_id]) {
      err(ws, `no such session id ${message.session_id}`, true)
      return
    }
  
    const response: Message = {
      type: MsgType.session_id,
      user_id: message.user_id,
    }
  
    const userSession = Object.values(sessions).find((session: Session) =>
      session.guests.find(guest => guest.id === message.user_id),
    )
  
    if (!userSession) {
      sessions[message.session_id].guests.push({ id: ws.user_id } as User)
      response.session_id = message.session_id
    } else {
      response.session_id = userSession.session_id
    }
  
    ws.session_id = message.session_id
    msg(ws, response)
  
    sessions[message.session_id].guesses.forEach(guess => {
      msg(ws, { type: MsgType.guess, content: guess })
    })
  }
  
  export function guess(ws: WS, message: Message) {
    try {
      validateResponse(message)
    } catch (e) {
      err(ws, e, true)
      return
    }
  
    if (!message.session_id) {
      err(ws, 'no session_id', true)
      return
    }
  
    const session = sessions[message.session_id]
    if (!session) {
      err(ws, 'no such session_id', true)
      return
    }
    const MAX_GUESSES = 20
    if (session.guesses.length >= MAX_GUESSES) {
      endSession(ws, 'no more guesses')
      return
    }
  
    let guess = wordToRow(message.content as string)
    evaluateGuess(guess, wordToRow(session.answer))
    session.guesses.push(guess)
  
    const sessionGuests: WS[] = []
    wss.clients.forEach((client: WS) => {
      if (
        session.guests.find(guest => {
          return guest.id === client.user_id
        })
      ) {
        sessionGuests.push(client)
      }
    })
  
    message.content = guess
    const correct = isCorrect(guess)
    sessionGuests.forEach((guest, i) => {
      msg(guest, message)
      if (correct) {
        const winMsg = {
          ...message,
          type: MsgType.info,
          content: `correct! winner: ${ws.user_id}`,
        }
  
        msg(guest, winMsg)
        remove(guest)
      }
    })
  }
  
  function endSession(cnx, message) {
    const session = sessions[cnx.session_id]
    if (!session) {
      err(cnx, message, true)
      remove(cnx)
      return
    }
  
    session.guests.forEach(guest => {
      err(guest, message, true)
      remove(guest)
    })
  }