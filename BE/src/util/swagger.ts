import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger 설정
 *
 * @param {INestApplication} app
 *
 */

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Juga API')
    .setDescription('Juga API 문서입니다.')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
