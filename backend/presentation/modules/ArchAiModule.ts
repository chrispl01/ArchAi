import { Module } from '@nestjs/common';
import { ArchAiService } from '../../application/services/ArchAiService'
import { ApiCaller } from '../../infrastructure/ApiCaller/ApiCaller';
import { ArchAiController } from '../controller/ArchAi/ArchAiController';

@Module({
  controllers: [ArchAiController],
  providers: [
    ArchAiService,
    {
      provide: 'IApiCaller',
      useClass: ApiCaller,
    },
  ],
})
export class ArchAiModule {}
