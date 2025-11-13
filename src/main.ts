import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function createNestServer() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  return app;
}
async function bootstrap() {
  if (!process.env.VERCEL) {
    const app = await createNestServer();
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Hunarmand backend api')
      .setVersion('v1')
      .setDescription('The api only made for Hunarmand!')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  }
}

bootstrap();
