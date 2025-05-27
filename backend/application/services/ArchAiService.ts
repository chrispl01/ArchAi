import {
  BadRequestException,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IAiApiCaller } from '../Interfaces/IAiApiCaller';

@Injectable()
export class ArchAiService {
  constructor(
    @Inject('IAiApiCaller')
    private readonly aiApiCaller: IAiApiCaller,
  ) {}

  async GetCompletion(prompt: string): Promise<string> {
    return this.aiApiCaller.GetCompletion(prompt);
  }
}
