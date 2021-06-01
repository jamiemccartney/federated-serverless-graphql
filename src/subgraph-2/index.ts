const { schema } = require('./schema');
const CatFactsAPI = require('@datasources/cats');
const { ApolloServer } = require('apollo-server-lambda');
const { decode } = require('@libs/jwt-utils');

// @ts-ignore
const server = new ApolloServer({
    schema,
    context: ({ event }: any) => {
        const token = event.headers['x-token'];
        const decodedToken = decode(token);

        if (decodedToken) {
            return decodedToken;
        }

        return {}
    },
});

exports.graphqlHandler = server.createHandler();