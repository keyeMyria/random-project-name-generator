import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { UsersService } from '../../../users/services/users/users.service';
import { ConfigService } from '../../../shared/services/config/config.service';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKeySecret: string;

  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    this.jwtOptions = { expiresIn: configService.get('JWT_EXPIRES') };
    this.jwtKeySecret = configService.get('JWT_SECRET');
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.jwtKeySecret, this.jwtOptions);
  }

  async validatePayload(payload: JwtPayload) {
    return this.usersService.findOne({ email: payload.email.toLocaleLowerCase() });
  }
}
