import { ApolloServer } from 'apollo-server-lambda';

import CatFactsAPI from '@datasources/cats';
const { decode } = require('@libs/jwt-utils');

import { schema } from './schema';

const server = new ApolloServer({
    schema,
    context: ({ event }) => {
        const token = event.headers['x-token'];
        const decodedToken = decode(token);

        if (decodedToken) {
            return decodedToken;
        }

        return {}
    },
    dataSources: () => {
      return {
          cats: new CatFactsAPI()
      }
    },
});

exports.graphqlHandler = server.createHandler();
