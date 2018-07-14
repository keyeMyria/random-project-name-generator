import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { RegisterRequest } from '../../requests/register.request';
import { RegisterResponse } from '../../responses/register.response';
import { LoginResponse } from '../../responses/login.response';
import { LoginRequest } from '../../requests/login.request';
import { User, UserRole } from '../../models/user.model';
import { EnumHelper } from '../../../shared/helpers/enum.helper';
import { MapperService } from '../../../shared/services/mapper/mapper.service';
import { UserViewModel } from '../../view-models/user.view-model';
import { FindAllResponse } from '../../responses/find-all.response';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly mapperService: MapperService) {
  }

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    if (registerRequest.username && registerRequest.email && registerRequest.password) {
      const user: User = await this.usersService.register(registerRequest);
      const userViewModel: UserViewModel = this.mapperService.map<User, UserViewModel>(user, UserViewModel);

      return {
        data: userViewModel,
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

  @Get('test-register')
  async testRegister(): Promise<RegisterResponse> {
    await this.usersService.clearAll();
    return this.register({
      email: 'christoph.stach@ŋmail.com',
      password: '123456',
      username: 'christophstach',
      role: UserRole.Admin,
      firstName: 'Christoph',
      lastName: 'Stach',
    });
  }

  @Get('test-login')
  async testLogin(): Promise<LoginResponse> {
    return this.login({
      email: 'christoph.stach@ŋmail.com',
      password: '123456',
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<FindAllResponse> {
    const users: User[] = await this.usersService.findAll();
    const userViewModels: UserViewModel[] = users.map((user: User) => this.mapperService.map<User, UserViewModel>(user, UserViewModel));

    return {
      data: userViewModels,
    };
  }

  @Get('test')
  async test() {
    return EnumHelper.values(UserRole);
  }

  /*
    async create(@Body() user: UserInterface): Promise<User> {
      return this.usersService.create(user);
    }



    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
      return this.usersService.findOne(id);
    }

    @Put()
    async update() {

    }

    @Delete()
    async delete() {

    }

    @Get('create-test')
    async createTestUser() {

      //return this.usersService.create(user);
    }
  */
}
