const { sharedAuth } = require('@libs/auth-directive');
const { attachDirectiveResolvers } = require('graphql-tools');
const { buildFederatedSchema } = require('@apollo/federation');
const { gql } = require('apollo-server');

const typeDefs = gql`

  ${sharedAuth.authDirective}

  type Query {
    review: Review @hasRoles(roles: ["REVIEWS"])
    catFact: Fact @hasRoles(roles: ["CATFACTS"])
  }
  
  type Review @key(fields: "id") {
    id: ID!
    review: String
   }
   
   type Fact {
    fact: String
    length: Int
   }
`;

const resolvers = {
    Query: {
        async catFact(_: any, __: any, {dataSources}: any) {
            return await dataSources.cats.getFact()
        },
        async review() {
            return { id: '1234-1234-1234-1234', review: 'blablabla' }
        }
    },
};

const directiveResolvers = {
    hasRoles: sharedAuth.authResolver
};

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

attachDirectiveResolvers(
    schema,
    directiveResolvers,
);

export { schema }
