import { WS } from '../../lib/structs';
export { requestSession } from './session';
export declare function createWS(url?: string, port?: number): Promise<WS>;
