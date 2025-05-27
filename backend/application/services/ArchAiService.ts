import { Get, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IApiCaller } from '../promises/IApiCaller';

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
