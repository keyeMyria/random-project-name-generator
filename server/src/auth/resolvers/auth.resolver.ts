import { Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../../users/services/users.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly usersService: UsersService) {
  }

  @Mutation('register')
  async register(incomingMessage, args) {
    const { email, username, password, firstName, lastName } = args;

    return await this.usersService.register({ email, username, password, firstName, lastName });
  }

  @Mutation('login')
  async login(incomingMessage, args) {
    const { email, password } = args;

    return await this.usersService.login({ email, password });
  }

  @Mutation('verifyEmail')
  async verifyEmail() {
    return {
      email: 'test1234',
    };
  }
}