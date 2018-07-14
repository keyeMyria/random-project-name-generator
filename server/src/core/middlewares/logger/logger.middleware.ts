import { Injectable, Logger, MiddlewareFunction, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {

  }

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      this.logger.log('Request...');
      next();
    };
  }
}
