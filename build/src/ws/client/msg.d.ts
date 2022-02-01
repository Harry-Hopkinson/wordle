import { Message } from '../../lib/structs';
export declare function msg(cnx: {
    send: (arg0: string) => void;
}, m: Message): void;
export declare function validateMsg(cnx: any, data: any): any;
