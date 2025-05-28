import { BadRequestException, Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ArchAiService } from '../../../application/services/ArchAiService';
import { Completion } from 'domain/Completion';
import { Prompt } from 'domain/Prompt';

@Controller('ArchAi')
export class ArchAiController {
    constructor(private readonly aiService: ArchAiService) {}

    @Post('getCompletion')
    async getExample(@Body() prompt: Prompt){
        return await this.aiService.GetCompletion(prompt);
    }
}
