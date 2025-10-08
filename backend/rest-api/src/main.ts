import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.enableCors();

  // Log all incoming requests
  app.use((req, res, next) => {
    const logger = new Logger('HTTP');
    logger.log(`${req.method} ${req.url}`);
    next();
  });

  await app.listen(process.env.PORT ?? 3001);
  Logger.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
