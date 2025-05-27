import { HttpException, Injectable } from '@nestjs/common';
import { IAiApiCaller } from '../../application/Interfaces/IAiApiCaller';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiApiCaller implements IAiApiCaller {
  constructor(private configService: ConfigService) {}
  private httpService = new HttpService();

  public async GetCompletion(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('Configurations are missing!');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'ft:gpt-4.1-mini-2025-04-14:personal:archai:BZj9yJlz',
            store: false,
            messages: [{ role: 'user', content: prompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          },
        ),
      );
      return response.data.choices[0].message.content ?? '0';
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
