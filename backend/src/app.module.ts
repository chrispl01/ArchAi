import { Module } from '@nestjs/common';
import { ArchAiModule } from 'src/modules/ArchAiModule';

@Module({
  imports: [ArchAiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
