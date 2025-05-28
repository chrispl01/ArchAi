// AiApiCaller interface for DI
export interface IAiApiCaller {
    GetCompletion(promt: string): Promise<string>;
}
