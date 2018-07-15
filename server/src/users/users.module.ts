import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './services/users/users.service';

import { UsersController } from './controllers/users/users.controller';
import { User } from './models/user.model';
import { UserSchema } from './schemas/user.schema';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    UsersService,
    UsersResolver,
  ],
  exports: [
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {
}
