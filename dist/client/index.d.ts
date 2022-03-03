import { XServerClientOptions, BaseLicenseOptions, ExtendLicenseKeyOptions, BindDiscordUserOptions, EternalLicenseOptions, MetaLicenseKeyOptions, BanLicenseKeyOptions, LicenseOptions, ConfirmTransferOptions } from './interface';
export * from './interface';
export declare class XServerClient {
    private apiKey;
    private axios;
    constructor(options: XServerClientOptions);
    private handleError;
    testConnection: () => Promise<any>;
    /**
     * Return all generated license keys
     */
    dumpKeys: () => Promise<any>;
    /**
     * Query license key information
     */
    queryKey: (serialkey: string) => Promise<any>;
    /**
     * Extend the days alloted to a license key
     */
    extendKey: (context: ExtendLicenseKeyOptions) => Promise<any>;
    /**
     * Reset the specified license key
     */
    resetKey: (context: BaseLicenseOptions) => Promise<any>;
    /**
     * List license keys attached to a specified email address
     */
    listKeys: (email: string) => Promise<any>;
    /**
     * Attached discord credentials to a license key
     */
    bindDiscord: (context: BindDiscordUserOptions) => Promise<any>;
    /**
     * Remove discord credentials from a license key
     */
    unbindDiscord: (context: BaseLicenseOptions) => Promise<any>;
    /**
     * List available tiers
     */
    listTiers: () => Promise<any>;
    /**
     * Create an eternal license key
     */
    createEternalKey: (context: EternalLicenseOptions) => Promise<any>;
    /**
     * Update attached meta information
     */
    updateMeta: (context: MetaLicenseKeyOptions) => Promise<any>;
    /**
     * Ban license key
     */
    banKey: (context: BanLicenseKeyOptions) => Promise<any>;
    /**
     * Create license key
     */
    createKey: (context: LicenseOptions) => Promise<any>;
    /**
     * Transfer serial key to new purchase email
     */
    beginTransfer: (context: BaseLicenseOptions) => Promise<any>;
    /**
     * Complete purchase email transfer for serial key
     */
    confirmTransfer: (context: ConfirmTransferOptions) => Promise<any>;
}
//# sourceMappingURL=index.d.ts.map