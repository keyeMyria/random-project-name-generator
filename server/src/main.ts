import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './shared/services/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.create(AppModule, new FastifyAdapter());
  await app.listen(configService.get('PORT'));
}

bootstrap();
