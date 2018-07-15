import { UserDto } from '../dtos/user.dto';

export interface LoginResponse {
  data:  {
    token: string
  }
}