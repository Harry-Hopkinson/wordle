import { WS, Message, User, Row } from '../../lib/structs';
export declare class Session {
    session_id: string;
    guests: User[];
    answer: string;
    guesses: Row[];
    constructor(session_id: string);
}
export declare function remove(ws: any): void;
export declare function createSession(ws: WS, message: Message): void;
export declare const sessions: {
    [key: string]: Session;
};
export declare function join(ws: WS, message: Message): void;
export declare function guess(ws: WS, message: Message): void;
