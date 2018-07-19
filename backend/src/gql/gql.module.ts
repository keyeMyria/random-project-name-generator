import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';


@Module({
  imports: [GraphQLModule],
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
      .apply(graphqlExpress(req => {
        return {
          schema,
          rootValue: req,
        };
      }))
      .forRoutes('/graphql');
  }
}
