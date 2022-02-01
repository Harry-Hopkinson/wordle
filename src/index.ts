import { Visibility, Option, Row, Message } from './lib/structs'
import { words, alphabet, letters } from './util'

export function wordToRow(word: string): Array<Option> {
  return word.split('').map(letter => ({
    letter,
    visibility: Visibility.hidden,
  }))
}

export function validateResponse(response: Message): void {
  if (!response.content || typeof response.content !== 'string') {
    throw 'bad guess'
  } else if (/[^a-z]/i.test(response.content)) {
    throw 'only a-zA-Z'
  } else if (response.content.length !== 5) {
    throw '5 letters only'
  } else if (!words[response.content.toLocaleLowerCase()]) {
    throw 'not in wordlist'
  }
}

export function evaluateGuess(guess: Row, answer: Row): void {
  guess.forEach((option: Option, i: number) => {
    const oL = option.letter.toLocaleLowerCase()
    const aL = answer[i].letter.toLocaleLowerCase()
    if (oL === aL) {
      option.visibility = Visibility.revealed
    } else if (letterExists(guess, i, answer)) {
      option.visibility = Visibility.exists
    } else {
      option.visibility = Visibility.guessed
    }

    if (letters[oL] !== Visibility.revealed) letters[oL] = option.visibility
  })
}

export function updateAlphabet(guess: Row): void {
  guess.forEach((option: Option, i: number) => {
    const oL = option.letter.toLocaleLowerCase()
    if (letters[oL] !== Visibility.revealed) {
      letters[oL] = option.visibility
    }
  })
}

function letterExists(guess, i, answer): boolean {
  const option = guess[i]
  if (!answer.find(l => l.letter === option.letter)) {
    return false
  }

  function sameLetterIndices(row: Row): number[] {
    return row.slice().reduce((a, v, j) => {
      if (v.letter === option.letter) {
        a.push(j)
      }
      return a
    }, [])
  }
  const sameAnswerLetterIndices = sameLetterIndices(answer)
  const sameGuessLetterIndices = sameLetterIndices(guess)
  const intersection = sameAnswerLetterIndices.filter(
    i => !sameGuessLetterIndices.includes(i),
  )

  sameGuessLetterIndices.forEach(i => {
    if (guess[i].visibility === Visibility.exists) {
      intersection.shift()
    }
  })

  if (intersection.length) {
    return true
  }

  return false
}

export function isCorrect(guess: Row): boolean {
  if (guess.some(letter => letter.visibility !== Visibility.revealed)) {
    return false
  }
  return true
}