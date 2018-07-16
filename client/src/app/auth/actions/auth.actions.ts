import { LoginRequest } from '../../users/services/users.service';

export class Login {
  static readonly type = '[Auth] Login';
  email: string;
  password: string;

  constructor({email, password}: LoginRequest) {
    this.email = email;
    this.password = password;
  }
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
}

export class LoginFailed {
  static readonly type = '[Auth] Login Failed';

  constructor(public error) {
    
  }
}

export class Logout {
  static readonly type = '[Auth] Logout';

  constructor() {

  }
}
