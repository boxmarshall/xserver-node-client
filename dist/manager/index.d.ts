import SafeEncode from '../safe-encode';
import { XServerManagerOptions, CatValidationOptions, BaseOptions } from './interface';
export * from './interface';
export interface Encoder {
    encoder: SafeEncode;
    machineToken: string;
}
export declare class XServerManager {
    private apiKey;
    private axios;
    constructor(options: XServerManagerOptions);
    generateEncoder: (data: string) => Promise<Encoder>;
    fetchMachineToken: (config: BaseOptions) => Promise<any>;
    private getID;
    validateCat: (config: CatValidationOptions) => Promise<any>;
}
//# sourceMappingURL=index.d.ts.map