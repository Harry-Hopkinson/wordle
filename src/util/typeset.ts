import * as chalk from 'chalk'

import { Visibility, Option, Row } from '../lib/structs'
import { words, alphabet, letters } from './'
import { display } from '../cli'

const optColorMap = {
  [Visibility.hidden]: chalk.chalkStderr.bgWhite,
  [Visibility.guessed]: chalk.chalkStderr.bgGray,
  [Visibility.exists]: chalk.chalkStderr.bgYellow,
  [Visibility.revealed]: chalk.chalkStderr.bgGreenBright,
}

export function typesetGuess(guess: Row): string {
  return guess
    .map((option: Option) => {
      return optColorMap[option.visibility](option.letter)
    })
    .join('')
}

export function typesetAlphabet(): string {
  return Object.entries(letters)
    .map(([k, v]) => {
      return optColorMap[v](k)
    })
    .join('')
}