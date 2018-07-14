import { UserRole } from '../models/user.model';


export class UserViewModel {
  id: string = null;
  username: string = null;
  email: string = null;
  role?: UserRole = null;
  firstName?: string = null;
  lastName?: string = null;
}
