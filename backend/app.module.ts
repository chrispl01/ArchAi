import { Module } from '@nestjs/common';
import { ArchAiModule } from './presentation/modules/ArchAiModule';
import { TestController } from 'presentation/controller/test/test.controller';

@Module({
  imports: [ArchAiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
