import { Global, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AttachUserToRequestMiddleware } from './middlewares/attach-user-to-request.middleware';
import { configService } from '../shared/services/config/config.service';
import { AuthResolver } from './resolvers/auth.resolver';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES'),
      },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    AuthService,
  ],
})

export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttachUserToRequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
