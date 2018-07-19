import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  data: {
    token: string;
  };
}

export interface RegisterResponse {
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly httpClient: HttpClient) {
  }



  register({email, username, password, firstName, lastName}: RegisterRequest): Observable<RegisterResponse> {
    const url = 'http://localhost:3000/users/register';

    return this.httpClient.post<RegisterResponse>(url, {
      email,
      username,
      password,
      firstName,
      lastName
    });
  }
}
