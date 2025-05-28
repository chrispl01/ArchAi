// ArchAiService

import { IAiApiCaller } from '../Interfaces/IAiApiCaller';
import { Completion } from '../../domain/Completion';
import { Prompt } from 'domain/Prompt';
import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class ArchAiService {
    constructor(
        @Inject('IAiApiCaller')
        private readonly aiApiCaller: IAiApiCaller,
    ) {}

	// GetCompelation from AiApiCaller
    async GetCompletion(prompt: Prompt): Promise<Completion> {
        // Check pormpt
		if (!prompt.prompt) {
            throw new BadRequestException('Field "prompt" required!');
        }
		
		const completion = new Completion();
        completion.prompt = prompt.prompt;

        try {
			// get message von ApiCaller - from OpenAi
            completion.message = await this.aiApiCaller.GetCompletion(
                completion.prompt,
            );

            return completion;
        } catch (error) {
            console.log(error);
            throw new HttpException(
                `Failed to process prompt: ${error.message}`,
                500,
            );
        }
    }
}
