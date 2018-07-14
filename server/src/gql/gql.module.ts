import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { PostsService } from './services/posts.service';
import { AuthorsService } from './services/authors.service';
import { PostResolver } from './resolvers/post.resolver';
import { AuthorResolver } from './resolvers/author.resolver';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';

@Module({
  imports: [GraphQLModule],
  providers: [
    PostsService,
    AuthorsService,

    PostResolver,
    AuthorResolver,
  ],
})
export class GqlModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {
  }

  configure(consumer: MiddlewareConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    const schema = this.graphQLFactory.createSchema({ typeDefs });

    consumer
      .apply(graphiqlExpress({ endpointURL: '/graphql' }))
      .forRoutes('/graphiql')
      .apply(graphqlExpress(req => ({ schema, rootValue: req })))
      .forRoutes('/graphql');
  }
}
