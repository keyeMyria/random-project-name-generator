import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { UsersService } from '../../../users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validatePayload(payload: JwtPayload) {
    return this.usersService.findOne({ email: payload.email.toLocaleLowerCase() });
  }
}
