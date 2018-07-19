import { NgModule } from '@angular/core';

import { MailService } from './services/mail.service';
import { ScrollSpyService } from './services/scroll-spy.service';
import { NavComponent } from './components/nav/nav.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { SharedModule } from '../shared/shared.module';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgxsModule, Store } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthModule } from '../auth/auth.module';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AuthStateModel } from '../auth/states/auth.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { GraphQLError } from 'graphql';
import { ApolloLink } from 'apollo-link';

export function createApollo(httpLink: HttpLink, store: Store, toastr: ToastrService) {
  const http = httpLink.create({uri: 'http://localhost:3000/graphql'});

  const auth = new ApolloLink((operation, forward) => {
    const jwt = store.snapshot().auth ? (store.snapshot().auth as AuthStateModel).jwt : null;

    if (jwt) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
    }

    return forward(operation);
  });

  const error = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
      graphQLErrors.map((err: GraphQLError) => {
        const message = (err.message as any).error;

        toastr.error(
          message,
          'GraphQL error'
        );
      });
    }

    if (networkError) {
      toastr.error(
        networkError.message,
        'Network error'
      );
    }
  });

  const link = ApolloLink.from([
    auth,
    error,
    http
  ]);

  return {
    link: link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        // fetchPolicy: 'network-only',
        errorPolicy: 'none'
      },
      query: {
        // fetchPolicy: 'network-only',
        errorPolicy: 'none'
      },
      mutate: {
        errorPolicy: 'none'
      }
    }
  };
}


@NgModule({
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false
    }),
    NgxsModule.forRoot([]),
    NgxsStoragePluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: (store: Store) => {
          const jwt = store.snapshot().auth ? (store.snapshot().auth as AuthStateModel).jwt : null;

          return {
            tokenGetter: () => jwt,
            whitelistedDomains: ['localhost:3000'],
            blacklistedRoutes: ['localhost:3000/users/login/']
          };
        },
        deps: [Store]
      }
    }),
    ApolloModule,
    HttpLinkModule
  ],
  providers: [
    MailService,
    ScrollSpyService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Store, ToastrService]
    }
  ],
  declarations: [
    AppShellComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent
  ],
  exports: [
    AppShellComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent
  ]
})
export class CoreModule {
}
