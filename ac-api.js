const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');
const DataLoader = require('dataloader');

const port = process.env.APOLLO_PORT || 4001;

const customerLoader = new DataLoader(keys => Promise.resolve(customers.filter(customer => keys.includes(customer.id))));

const customers = [
    { id: 'Basi', emailAddress: "bamboo leaves" },
    { id: 'Yun', emailAddress: "apple" }
]

const typeDefs = gql(readFileSync('./ac-api.graphql', { encoding: 'utf-8' }));
const resolvers = {
    Query: {
        allCustomers: () => {
            return customers;
        },
    },
    Customer: {
        attributes(_, arg) {
            return [{ key: 'foo', value: arg.foo }];
        },
        __resolveReference(customer) {
            return customerLoader.load(customer.id)
        }
    }
}
const server = new ApolloServer({schema: buildSubgraphSchema({ typeDefs, resolvers })});
server.listen({ port: port } ).then(({ url }) => {
  console.log(`🚀 Ac-api subgraph ready at ${url}`);
}).catch(err => {console.error(err)});
