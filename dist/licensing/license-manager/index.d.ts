/// <reference types="node" />
import Events from 'events';
export interface LicenseManagerOptions {
    productId: number;
    muid: string;
    host: string | null;
    timeout?: number;
}
export interface User {
    name: {
        familyName: string;
        givenName: string;
    };
    expiryDate: string;
    discord: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
        isBot: boolean;
        nitro: boolean;
        email: string;
        emailVerified: boolean;
    };
}
export declare class LicenseManager extends Events {
    private encoder;
    private timeout;
    private productId;
    private muid;
    private axios;
    private host;
    private socket;
    constructor(options: LicenseManagerOptions);
    private decode;
    private handleuser;
    private handledeauthorization;
    private createlink;
    private waitforconnection;
    private createConnection;
    disconnect: () => void;
    chainLicense(token: string): Promise<void>;
    checkLicense(license: string): Promise<void>;
    activateLicense(license: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map