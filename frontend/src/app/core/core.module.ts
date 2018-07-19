import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
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
import { NgxsStoragePluginModule, STORAGE_ENGINE, StorageEngine } from '@ngxs/storage-plugin';
import { isPlatformServer } from '@angular/common';

export function createApollo(httpLink: HttpLink, store: Store, toastr: ToastrService) {
  const http = httpLink.create({uri: 'https://api-dot-random-project-name-generator.appspot.com/graphql'});

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

export class LocalStorageEngine implements StorageEngine {
  private readonly isPlatformServer: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isPlatformServer = isPlatformServer(platformId);
  }

  get length(): number {
    if (!this.isPlatformServer) {
      return localStorage.length;
    } else {
      return null;
    }
  }

  clear() {
    if (!this.isPlatformServer) {
      localStorage.clear();
    }
  }

  getItem(key: any): any {
    if (!this.isPlatformServer) {
      return localStorage.getItem(key);
    } else {
      return null;
    }
  }

  key(val: number) {
    if (!this.isPlatformServer) {
      return localStorage.key(val);
    } else {
      return null;
    }
  }

  removeItem(key: any) {
    if (!this.isPlatformServer) {
      return localStorage.removeItem(key);
    } else {
      return null;
    }
  }

  setItem(key: any, val: any) {
    if (!this.isPlatformServer) {
      localStorage.setItem(key, val);
    } else {
      return null;
    }
  }
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
            whitelistedDomains: ['api-dot-random-project-name-generator.appspot.com'],
            blacklistedRoutes: []
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
    },
    {
      provide: STORAGE_ENGINE,
      useClass: LocalStorageEngine
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
