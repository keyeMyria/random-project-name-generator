import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RootController } from './controllers/root/root.controller';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { configService } from '../shared/services/config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(configService.get('DATABASE_CONNECTION_STRING')),
  ],
  controllers: [
    RootController,
  ],
  providers: [

    Logger,
  ],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
