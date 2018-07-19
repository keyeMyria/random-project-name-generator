import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { Login, LoginFailed, LoginSuccess, Logout } from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginResponse } from '../../users/services/users.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Navigate } from '@ngxs/router-plugin';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';

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
    private readonly toastr: ToastrService,
    private readonly apollo: Apollo
  ) {
  }

  ngxsOnInit({patchState, getState}: StateContext<AuthStateModel>) {
    const state = getState();

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
      tap((token) => {
        patchState({
          jwt: token,
          jwtPayload: this.jwtHelperService.decodeToken(token)
        });
      }),
      map(() => dispatch(new LoginSuccess())),
      catchError((error) => dispatch(new LoginFailed(error)))
    );
  }

  @Action(Logout)
  async logout({patchState, dispatch}: StateContext<AuthStateModel>) {
    dispatch(new Navigate(['/login']));
    patchState({jwt: null, jwtPayload: null});
    await this.apollo.getClient().resetStore();
    this.toastr.success('Logout Successful');
  }

  @Action(LoginSuccess)
  async loginSuccess({dispatch}: StateContext<AuthStateModel>, action: LoginSuccess) {
    dispatch(new Navigate(['/profile']));
    await this.apollo.getClient().resetStore();
    this.toastr.success('Login Successful');
  }

  @Action(LoginFailed)
  async loginFailed({patchState}: StateContext<AuthStateModel>, action: LoginFailed) {
    patchState({jwt: null, jwtPayload: null});
    await this.apollo.getClient().resetStore();
    this.toastr.error('Login Failed');
  }
}
