import { Injectable } from '@nestjs/common';
import { IApiCaller } from '../../application/promises/IApiCaller';

@Injectable()
export class ApiCaller implements IApiCaller {
  async getExample(): Promise<string> {
    return Promise.resolve('Hello World!');
  }
}
