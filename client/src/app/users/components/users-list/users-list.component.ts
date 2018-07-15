import { Component } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  users: any[];
  loading = true;

  constructor(private readonly apollo: Apollo) {
    const usersQuery = gql`
      {
        users {
          id
          username
          email
          role
          firstName
          lastName
        }
      }
    `;

    this.apollo.watchQuery<any>({query: usersQuery})
      .valueChanges
      .pipe(
        delay(5000)
      )
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.users = data.users;
      });
  }

}
