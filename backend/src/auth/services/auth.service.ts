import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginTokenPayload } from '../interfaces/login-token-payload.interface';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { User, UserRole } from '../../users/models/user.model';
import { VerificationTokenPayloadInterface } from '../interfaces/verification-token-payload.interface';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async signPayload(payload: LoginTokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validatePayload(payload: LoginTokenPayload) {
    return this.usersService.findOne({ email: payload.email.toLocaleLowerCase() });
  }

  async register({ username, email, password, firstName, lastName }): Promise<User> {
    const salt = await genSalt(10);

    try {
      const user = await this.usersService.create({
        username,
        email,
        password: await hash(password, salt),
        roles: [UserRole.USER],
        firstName,
        lastName,
        enabled: false,
      });

      const verificationTokenPayload: VerificationTokenPayloadInterface = {
        userId: user.id,
      };

      console.log(this.jwtService.sign(verificationTokenPayload));

      return user;
    } catch (e) {
      throw new GraphQLError('Registration failed');
    }
  }

  async login({ email, password }): Promise<string> {
    const user = await this.usersService.findOne({ email, enabled: true });

    if (!user) {
      throw new GraphQLError('Invalid credentials');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new GraphQLError('Invalid credentials');
    }

    const payload: LoginTokenPayload = {
      email: user.email,
      username: user.username,
      roles: user.roles,
    };

    return await this.signPayload(payload);
  }
}
