export { WS, WebSocket, WebSocketServer, Message, MsgType, User } from './net';
export declare enum Visibility {
    hidden = "hidden",
    guessed = "guessed",
    exists = "exists",
    revealed = "revealed"
}
export interface Option {
    letter: string;
    visibility: Visibility;
}
export declare type Row = Array<Option>;
