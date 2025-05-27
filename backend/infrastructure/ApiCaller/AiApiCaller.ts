import { Injectable } from '@nestjs/common';
import { IAiApiCaller } from '../../application/Interfaces/IAiApiCaller';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiApiCaller implements IAiApiCaller {
  private httpService = new HttpService();

  public async GetCompletion(prompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

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
        },
      ),
    );

    return response.data.choices[0].message.content ?? '0';
  }
}
