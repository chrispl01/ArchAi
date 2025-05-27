import { Test, TestingModule } from '@nestjs/testing';
import { ArchAiService } from './ArchAiService';

describe('ArchAiService', () => {
  let service: ArchAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchAiService,
        {
          provide: 'IApiCaller',
          useValue: {
            call: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<ArchAiService>(ArchAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
