import { Test, TestingModule } from '@nestjs/testing';
import { AiApiCaller } from './AiApiCaller';

describe('AiApiCaller', () => {
    let provider: AiApiCaller;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AiApiCaller],
        }).compile();

        provider = module.get<AiApiCaller>(AiApiCaller);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
