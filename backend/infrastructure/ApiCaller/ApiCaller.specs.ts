import { Test, TestingModule } from '@nestjs/testing';
import { ApiCaller } from './ApiCaller';

describe('ApiCaller', () => {
  let provider: ApiCaller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiCaller],
    }).compile();

    provider = module.get<ApiCaller>(ApiCaller);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
