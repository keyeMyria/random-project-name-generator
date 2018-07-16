import { Action, State, StateContext } from '@ngxs/store';
import { Login, LoginFailed, LoginSuccess, Logout } from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginResponse } from '../../users/services/users.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Navigate } from '@ngxs/router-plugin';

export interface JwtPayload {
  email: string;
  username: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
}

export interface AuthStateModel {
  jwt: string;
  jwtPayload: JwtPayload;
}

@State<AuthStateModel>({
  name: 'auth'
})
export class AuthState {
  constructor(private readonly authService: AuthService, private readonly jwtHelperService: JwtHelperService) {
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    const state = ctx.getState();

    return this.authService.login({email: action.email, password: action.password}).pipe(
      tap((response: LoginResponse) => {
        ctx.setState({
          ...state,
          jwt: response.data.token,
          jwtPayload: this.jwtHelperService.decodeToken(response.data.token)
        });
      }),
      map(() => ctx.dispatch(new LoginSuccess())),
      catchError((error) => ctx.dispatch(new LoginFailed(error)))
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      jwt: null,
      jwtPayload: null
    });

    return ctx.dispatch(new Navigate(['/']));
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {
    return ctx.dispatch(new Navigate(['/']));
  }

  @Action(LoginFailed)
  loginFailed(ctx: StateContext<AuthStateModel>, action: LoginFailed) {
    console.log(action.error);
  }
}
