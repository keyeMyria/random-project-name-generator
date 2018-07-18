import { UserRole } from '../../users/models/user.model';

export interface JwtPayload {
  email: string;
  username: string;
  roles: UserRole[];
}