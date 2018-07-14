import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    AuthService,
  ],
})

export class AuthModule {
}
