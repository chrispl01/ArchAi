import { Module } from '@nestjs/common';
import { ArchAiService } from '../../application/services/ArchAiService'
import { AiApiCaller } from 'infrastructure/ApiCaller/AiApiCaller';
import { ArchAiController } from '../controller/ArchAi/ArchAiController';

@Module({
  controllers: [ArchAiController],
  providers: [
    ArchAiService,
    {
      provide: 'IAiApiCaller',
      useClass: AiApiCaller,
    },
  ],
})
export class ArchAiModule {}
