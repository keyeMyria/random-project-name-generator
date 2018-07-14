import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../services/auth/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '../../shared/services/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this.authService.validatePayload(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user, payload.issuedAt);
  }
}