import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Company server')
    .setDescription('API of company server')
    .setVersion('1.0')
    .addTag('Company')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Cors of app
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  // app.enableVersioning({ type: VersioningType.URI });
  //Secutiry for app
  app.use(helmet());
  //For response size
  app.use(compression());
  await app.listen(3000);
}
bootstrap();
