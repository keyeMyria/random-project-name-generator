import { BaseModel } from '../../shared/base.model';

export enum UserRole {
  Admin = 'Admin',
  User = 'User'
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