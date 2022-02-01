import { Option, Row, Message } from './lib/structs';
export declare function wordToRow(word: string): Array<Option>;
export declare function validateResponse(response: Message): void;
export declare function evaluateGuess(guess: Row, answer: Row): void;
export declare function updateAlphabet(guess: Row): void;
export declare function isCorrect(guess: Row): boolean;
