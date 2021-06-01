import { GraphQLError } from "graphql";

import { ApolloServer } from 'apollo-server-lambda';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { sign } from '@libs/jwt-utils';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request }: any) {
        const token = sign({
            capabilities: ['REVIEWS', 'COMMENTS', 'CATFACTS'],
        });

        request.http.headers.set('x-token', token);
    }
}

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'reviews', url: 'http://localhost:8081/reviews' },
        { name: 'comments', url: 'http://localhost:8081/comments' },
    ],
    buildService: ({ url }) => ( new AuthenticatedDataSource({ url }) ),
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,
    formatError: (error: any) =>  {
        console.log(error instanceof GraphQLError)
        if (error instanceof GraphQLError) {
            console.log(error?.extensions)
            return {
                service: error?.extensions?.serviceName,
                error: error?.extensions?.exception?.message,
            }
        }
        return {
            service: error?.extensions?.serviceName,
            error: error?.extensions?.exception.message,
            violatingField: error?.extensions?.exception?.path[error?.extensions?.exception?.path?.length-1]
        }
    },
    subscriptions: false,
});

exports.graphqlHandler = server.createHandler();