import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {Logger} from 'nestjs-pino';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});

  // Configurar Logger (Pino)
  app.useLogger(app.get(Logger));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Notification System API')
    .setDescription('API para sistema de notificações em tempo real com autenticação Google')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
