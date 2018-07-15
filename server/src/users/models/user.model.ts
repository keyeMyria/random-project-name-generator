import { BaseModel } from '../../shared/base.model';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User extends BaseModel {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}