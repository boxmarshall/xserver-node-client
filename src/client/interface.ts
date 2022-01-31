export interface XServerClientOptions {
    apiKey: string;
    baseUrl?: string;
}


export interface BaseLicenseOptions {
    serialkey: string;
    email: string;
}

export interface ExtendLicenseKeyOptions {
    serialkey: string;
    days: number;
}

export interface MetaLicenseKeyOptions {
    serialkey: string;
    meta: {
        [key: string]: string;
    }
}

export interface BanLicenseKeyOptions {
    serialkey: string;
    state: boolean;
}

export interface BindDiscordUserOptions {
    serialkey: string;
    email: string;
    discord: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
        isBot: boolean;
        nitro: boolean;
        email: string;
        emailVerified: boolean;
    }
}

export interface LicenseOptions {
    email: string;
    givenName: string;
    familyName: string;
    tierHash?: string;
    days: number;
    meta?: MetaLicenseKeyOptions['meta'];
}

export interface EternalLicenseOptions extends LicenseOptions {

}


export interface ConfirmTransferOptions {
    serialkey: string;
    email: string;
    familyName: string;
    givenName: string;
    transferCode: string;
}