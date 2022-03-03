/// <reference types="node" />
import Events from 'events';
import { User } from './license-manager';
export { User } from './license-manager';
export declare class Railgun extends Events {
    private productId;
    private host;
    private mid;
    private manager;
    constructor(productId: number, host?: string | null);
    get chaintoken(): string;
    private waitforconnection;
    private fetchUser;
    logout: () => void;
    chain: (chaintoken: string) => Promise<User>;
    validate: (license: string, muid: string) => Promise<User>;
}
//# sourceMappingURL=index.d.ts.map