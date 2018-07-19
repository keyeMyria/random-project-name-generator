import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './shared/services/config/config.service';
import { AnyExceptionFilter } from './core/filters/any-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new AnyExceptionFilter());
  await app.listen(configService.get('PORT'));
}

bootstrap();
