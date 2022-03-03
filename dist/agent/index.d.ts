/// <reference types="node" />
import Events from 'events';
import { Socket } from 'socket.io-client';
import SafeEncode from '../safe-encode';
interface SocketHeader {
    [key: string]: string;
}
export interface AgentOptions {
    url: string;
    accessToken: string;
    seed: number;
    path: string;
    machineToken: string;
    headers?: SocketHeader;
    timeout?: number;
}
export interface Solution {
    encoder: SafeEncode;
    socket: Socket;
    sid: string;
}
export interface SynchronizationPayload {
    securityKey: string;
    socket: Solution['socket'];
}
export declare class XServerAgent extends Events {
    private url;
    private path;
    private seed;
    private headers;
    private accessToken;
    private machineToken;
    private timeout;
    constructor(options: AgentOptions);
    createTimestamp: () => string;
    validate: () => Promise<SynchronizationPayload>;
    connect: () => Promise<Solution>;
}
export {};
//# sourceMappingURL=index.d.ts.map