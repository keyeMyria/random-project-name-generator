import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly apollo: Apollo) {
  }

  login({email, password}): Observable<string> {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          login(
            email: "${email}"
            password: "${password}"
          )
        }
      `
    }).pipe(
      map(response => response.data.login)
    );
  }

  register({email, username, password, firstName, lastName}) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          register(
            email: "${email}"
            username: "${username}"
            password: "${password}"
            firstName: "${firstName}"
            lastName: "${lastName}"
          ) {
            id
            username
            email
            roles
            firstName
            lastName
          }
        }
      `
    });
  }
}
