export default class SafeEncode {
    private key;
    private iterations;
    private keySize;
    constructor(key: string);
    generatePayload: (payload: any) => string;
    decodePayload: (encrypted: string) => any;
    encode: (token: string) => string;
    decode: (raw: string) => string;
}
//# sourceMappingURL=index.d.ts.map