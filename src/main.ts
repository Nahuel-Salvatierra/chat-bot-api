import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { appSetup } from '@config/app-setup';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  appSetup(app);

  const port = configService.get('server.port') || 3000;

  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}

bootstrap();
