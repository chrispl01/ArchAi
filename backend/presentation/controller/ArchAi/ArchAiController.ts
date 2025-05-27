import { Controller, Get } from '@nestjs/common';
import { ArchAiService } from '../../../application/services/ArchAiService';

@Controller('ArchAi')
export class ArchAiController {
    constructor(private readonly openAiService: ArchAiService) {}

    @Get('generateArchitecture')
    async getExample(){
        return await this.openAiService.getResponse();
    }
}
