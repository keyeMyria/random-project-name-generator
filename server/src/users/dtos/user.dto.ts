import { UserRole } from '../models/user.model';
import { BaseDto } from '../../shared/base.dto';

export class UserDto extends BaseDto {

  readonly username: string = null;
  readonly email: string = null;
  readonly roles?: UserRole[] = null;
  readonly firstName?: string = null;
  readonly lastName?: string = null;
}
