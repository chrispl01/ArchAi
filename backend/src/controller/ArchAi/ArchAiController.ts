import { BadRequestException, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ArchAiService } from '../../../application/services/ArchAiService';

@Controller('ArchAi')
export class ArchAiController {
    constructor(private readonly aiService: ArchAiService) {}

    @Post('getCompletion')
    async getExample(){
        throw new BadRequestException("shit");
        return await this.aiService.GetCompletion("Write a joke!");
    }
}
