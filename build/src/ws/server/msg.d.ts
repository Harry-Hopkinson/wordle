import { Message } from '../../lib/structs';
export declare function msg(cnx: any, m: Message): void;
export declare function err(cnx: any, e: any, send?: boolean): void;
export declare function validateMsg(cnx: any, data: any): any;
