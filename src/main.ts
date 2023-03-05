import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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
  //INFO: set app port dynamically
  await app.listen(process.env.PORT);
  logger.log(`App Running on port ${process.env.PORT}`);
}
bootstrap();
