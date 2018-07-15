import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RootController } from './controllers/root/root.controller';
import { RequestLoggerMiddleware } from './middlewares/logger/request-logger.middleware';
import { configService } from '../shared/services/config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(configService.get('DATABASE_CONNECTION_STRING')),
  ],
  controllers: [
    RootController,
  ],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
