import { Test, TestingModule } from '@nestjs/testing';
import { ArchAiController } from './ArchAiController';
import { ArchAiService } from '../../../application/services/ArchAiService';

describe('ArchAiController', () => {
  let controller: ArchAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchAiController],
      providers: [
        ArchAiService,
        {
          provide: 'IApiCaller',
          useValue: {
            call: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArchAiController>(ArchAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
