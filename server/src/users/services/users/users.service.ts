import { Model } from 'mongoose';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { filter, find, identity, pickBy } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/user.model';
import { BaseService } from '../../../shared/base.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { RegisterRequest } from '../../requests/register.request';
import { LoginRequest } from '../../requests/login.request';
import { UserDto } from '../../dtos/user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel('User') readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {
    super();
    this.model = userModel;
  }

  async register({ username, email, password, firstName, lastName, role }: RegisterRequest): Promise<User> {
    const newUser = new this.model();
    newUser.username = username;
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.role = role;

    const salt = await genSalt(10);
    newUser.password = await hash(password, salt);

    return await this.create(newUser);
  }

  async login({ email, password }: LoginRequest): Promise<string> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      username: user.username,
      role: user.role,
      issuedAt: new Date(),
    };

    return await this.authService.signPayload(payload);
  }
}
