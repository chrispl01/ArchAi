import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './presentation/exception-filter/CustomExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activate swagger by debugging
  if(process.env.NODE_ENV === 'development'){
    const config = new DocumentBuilder()
      .setTitle("Klaus")
      .setDescription("API description")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }


  app.useGlobalFilters(new CustomExceptionFilter());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
