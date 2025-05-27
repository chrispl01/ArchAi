export interface IAiApiCaller {
  GetCompletion(promt: string): Promise<string>;
}
