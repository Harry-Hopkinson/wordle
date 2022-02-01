import { Row } from '../lib/structs';
declare class Display {
    screen: string[];
    offBy: number;
    constructor();
    addToGuesses(guess: Row): void;
    alterMessage(message?: string, color?: string): void;
    print(): void;
}
export declare const display: Display;
export declare function infoIndex(): number;
export {};
