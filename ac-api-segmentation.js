const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const port = process.env.APOLLO_PORT || 4002;

const customers = [
    { id: 'Basi' },
    { id: 'Yun' }
]

const typeDefs = gql(readFileSync('./ac-api-segmentation.graphql', { encoding: 'utf-8' }));
const resolvers = {
    Query: {
        executeSegment: (_, args, context) => {
            return customers;
        },
    },
}
const server = new ApolloServer({schema: buildSubgraphSchema({ typeDefs, resolvers })});
server.listen( {port: port} ).then(({ url }) => {
  console.log(`🚀 Ac-api-segmentation subgraph ready at ${url}`);
}).catch(err => {console.error(err)});
