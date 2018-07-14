import { UserRole } from '../models/user.model';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}