import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  //INFO: setting to add prefix to endpoints
  app.setGlobalPrefix('api');
  //INFO: setting to enable api version
  //app.enableVersioning({
  //  type: VersioningType.URI,
  //  defaultVersion: '2',
  //});
  //INFO: apply global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //INFO: Add open api documentation (swagger) to the project
  const config = new DocumentBuilder()
    .setTitle('Teslo RestFull API')
    .setDescription('Teslo Shop Endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //INFO: set app port dynamically
  await app.listen(process.env.PORT);
  logger.log(`App Running on port ${process.env.PORT}`);
}
bootstrap();
