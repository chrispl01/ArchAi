import { Inject, Injectable } from '@nestjs/common';
import { IApiCaller } from 'application/promises/IApiCaller';

@Injectable()
export class ArchAiService {
    constructor(
        @Inject('IApiCaller')
        private readonly openAiCaller: IApiCaller
    ){}

    async getResponse() : Promise<string>{
        return await this.openAiCaller.getExample();
    }
}
