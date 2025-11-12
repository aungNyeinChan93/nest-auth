/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {


  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn']
  });

  app.useGlobalInterceptors(new ResponseInterceptor())

  app.useStaticAssets(join(process.cwd(), 'public'));

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('Swagger example')
    .setDescription('The Swagger API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
