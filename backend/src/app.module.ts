import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { ArchAiModule } from 'src/modules/ArchAiModule';
import { ConfigModule } from '@nestjs/config';

@Module({

    imports: [
      // set configuration from ".env" file
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ArchAiModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
