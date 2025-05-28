import {
    Body,
    Controller,
    Post,
    Get
} from '@nestjs/common';
import { ArchAiService } from '../../../application/services/ArchAiService';
import { Prompt } from 'domain/Prompt';

@Controller('ArchAi')
export class ArchAiController {
    constructor(private readonly aiService: ArchAiService) {}

    // Post Request
    @Get('getCompletion')
    async getExample(@Body() prompt: Prompt) {
        return await this.aiService.GetCompletion(prompt);
    }
}
