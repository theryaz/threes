import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

// Import each models schema
import { UserSchema } from './user';

export const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
      name: 'Query',
      fields: () => Object.assign(
          UserSchema.query,
      )
  }),
  mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => Object.assign(
          UserSchema.mutation,
      )
  }),
  // subscription: new GraphQLObjectType({
  //     name: 'Subscription',
  //     fields: () => Object.assign(
  //         UserSchema.subscription,
  //     )
  // }),
  types: [
      ...UserSchema.types,
  ]
});
