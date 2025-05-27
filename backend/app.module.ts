import { Module } from '@nestjs/common';
import { ArchAiModule } from './presentation/modules/ArchAiModule';

@Module({
  imports: [ArchAiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
