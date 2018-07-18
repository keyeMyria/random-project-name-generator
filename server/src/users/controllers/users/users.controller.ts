import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { RegisterRequest } from '../../requests/register.request';
import { RegisterResponse } from '../../responses/register.response';
import { LoginResponse } from '../../responses/login.response';
import { LoginRequest } from '../../requests/login.request';
import { User } from '../../models/user.model';
import { MapperService } from '../../../shared/services/mapper/mapper.service';
import { UserDto } from '../../dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly mapperService: MapperService) {
  }

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    if (registerRequest.username && registerRequest.email && registerRequest.password) {
      const user: User = await this.usersService.register(registerRequest);
      const userDto: UserDto = this.mapperService.map<User, UserDto>(user, UserDto);

      return {
        data: userDto,
      };
    } else {
      throw new BadRequestException();
    }
  }

  @Post('login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    if (loginRequest.email && loginRequest.password) {
      return {
        data: {
          token: await this.usersService.login(loginRequest),
        },
      };
    } else {
      throw new BadRequestException();
    }
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'user')
  async secret(): Promise<string>{
    return Promise.resolve('Test');
  }
}
