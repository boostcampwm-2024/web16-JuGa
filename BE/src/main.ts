import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

const logger = new Logger('Bootstrap');
bootstrap().catch((err) => {
  logger.error('Failed to start application:', err);
  process.exit(1);
});
