import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../models/user.model';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Query('users')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async getUsers(obj, args, context, info) {
    return await this.usersService.findAll();
  }

  @Query('user')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async getUser(obj, args, context, info) {
    const { id } = args;

    return await this.usersService.findById(id);
  }
}