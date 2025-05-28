import {
  BadRequestException,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IAiApiCaller } from '../Interfaces/IAiApiCaller';
import { Completion } from '../../domain/Completion';
import { Prompt } from 'domain/Prompt';

@Injectable()
export class ArchAiService {
  constructor(
    @Inject('IAiApiCaller')
    private readonly aiApiCaller: IAiApiCaller,
  ) {}

  async GetCompletion(prompt: Prompt): Promise<Completion> {
    if(!prompt.prompt){
      throw new BadRequestException("Field \"prompt\" required!")
    }

    const completion = new Completion();
    completion.prompt = prompt.prompt;

    try {
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
