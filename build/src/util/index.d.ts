import { Visibility } from '../lib/structs';
export { typesetGuess, typesetAlphabet } from './typeset';
export { names } from './data/names';
export declare const words: {};
export declare const alphabet: string[];
export declare const letters: {
    [key: string]: Visibility;
};
export declare function getRand(from: string[]): string;
