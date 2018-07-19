import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation('register')
  async register(incomingMessage, args) {
    const { email, username, password, firstName, lastName } = args;

    return await this.authService.register({ email, username, password, firstName, lastName });
  }

  @Mutation('login')
  async login(incomingMessage, args) {
    const { email, password } = args;

    return await this.authService.login({ email, password });
  }

  @Mutation('verifyEmail')
  async verifyEmail() {
    return {
      email: 'test1234',
    };
  }
}