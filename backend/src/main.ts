import { CustomExceptionFilter } from './exception-middleware/CustomExceptionFilter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Activate swagger by debugging ("npm run start:dev" accessable by localhost:PORT/api)
    if (process.env.NODE_ENV === 'development') {
        const config = new DocumentBuilder()
            .setTitle('ArchAi')
            .setDescription('API Endpoint description')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
        // Enable dev CORS
        app.enableCors({
            origin: `http://localhost:3000`,
            methods: 'GET'
        });
    }

    // Trust nginx proxy for throtller
    app.getHttpAdapter().getInstance().set('trust proxy', true);

    // register globarl middleware
    app.useGlobalFilters(new CustomExceptionFilter());

    await app.listen(5000);
}
bootstrap();
