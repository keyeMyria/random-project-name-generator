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
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AuthStateModel } from '../auth/states/auth.state';


@NgModule({
  imports: [
    SharedModule,
    NgxsModule.forRoot([]),
    NgxsStoragePluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: (store: Store) => {
          const jwt = (store.snapshot().auth as AuthStateModel).jwt;

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
    HttpLinkModule,
    AuthModule
  ],
  providers: [
    MailService,
    ScrollSpyService
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
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({uri: 'http://localhost:3000/graphql'}),
      cache: new InMemoryCache()
    });
  }
}
