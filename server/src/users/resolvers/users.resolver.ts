import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../services/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Query('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers(obj, args, context, info) {
    return await this.usersService.findAll();
  }

  @Query('user')
  @UseGuards(AuthGuard('jwt'))
  async getUser(obj, args, context, info) {
    const { id } = args;

    return await this.usersService.findById(id);
  }
}