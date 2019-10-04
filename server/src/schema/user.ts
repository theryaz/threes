import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import { getUsers, getUserById, getUserByUsername, addUser } from '../db/users';

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Auth user',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const query = {
  users: {
      type: new GraphQLList(userType),
      resolve: (root) => getUsers()
  },
  userByUsername: {
      type: userType,
      args: {
          username: {
              description: 'find by username',
              type: GraphQLString
          }
      },
      resolve: (root, { username }) => getUserByUsername(username)
  },
};

const mutation = {
  addUser: {
      type: userType,
      args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (obj, input) => addUser(input)
  },
};

const subscription = {

};

export const UserSchema = {
  query,
  mutation,
  subscription,
  types: [userType]
};
