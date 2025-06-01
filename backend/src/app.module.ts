import { Module } from '@nestjs/common';
import { ArchAiModule } from 'src/modules/ArchAiModule';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        // set configuration from ".env" file
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        // Add api limit with throttler
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 86400,
                    limit: 5,
                },
            ],
        }),
        ArchAiModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard, // Bind guard globally
        },
    ],
})
export class AppModule {}
