import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest, LoginResponse } from '../../users/services/users.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly jwtHelperService: JwtHelperService, private readonly httpClient: HttpClient) {
  }

  login({email, password}: LoginRequest): Observable<LoginResponse> {
    const url = 'http://localhost:3000/users/login';

    return this.httpClient.post<LoginResponse>(url, {
      email,
      password
    });
  }
}
