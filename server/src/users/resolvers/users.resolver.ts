import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../services/users/users.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Query('users')
  async getUsers(obj, args, context, info) {
    return await this.usersService.findAll();
  }

  @Query('user')
  async getUser(obj, args, context, info) {
    const { id } = args;

    return await this.usersService.findById(id);
  }
}