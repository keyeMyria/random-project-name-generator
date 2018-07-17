import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { Login, LoginFailed, LoginSuccess, Logout } from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginResponse } from '../../users/services/users.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Navigate } from '@ngxs/router-plugin';
import { ToastrService } from 'ngx-toastr';

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
export class AuthState implements NgxsOnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtHelperService: JwtHelperService,
    private readonly toastr: ToastrService
  ) {
  }

  ngxsOnInit({patchState, getState}: StateContext<AuthStateModel>) {
    const state = getState();

    console.log(this.jwtHelperService.getTokenExpirationDate(state.jwt));
    if (state.jwt && this.jwtHelperService.isTokenExpired(state.jwt)) {
      patchState({
        jwt: null,
        jwtPayload: null
      });
    }
  }

  @Action(Login)
  login({patchState, dispatch}: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login({email: action.email, password: action.password}).pipe(
      tap((response: LoginResponse) => {
        patchState({
          jwt: response.data.token,
          jwtPayload: this.jwtHelperService.decodeToken(response.data.token)
        });
      }),
      map(() => dispatch(new LoginSuccess())),
      catchError((error) => dispatch(new LoginFailed(error)))
    );
  }

  @Action(Logout)
  logout({patchState, dispatch}: StateContext<AuthStateModel>) {
    patchState({
      jwt: null,
      jwtPayload: null
    });

    return dispatch(new Navigate(['/']));
  }

  @Action(LoginSuccess)
  loginSuccess({dispatch}: StateContext<AuthStateModel>, action: LoginSuccess) {
    this.toastr.success('Login Successful');

    return dispatch(new Navigate(['/']));
  }

  @Action(LoginFailed)
  loginFailed({}: StateContext<AuthStateModel>, action: LoginFailed) {
    this.toastr.error('Login Failed');
  }
}
