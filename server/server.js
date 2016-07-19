import { schema } from '/lib/schema';

import { apolloServer } from 'apollo-server';
import express from 'express';

const GRAPHQL_PORT = 8080;

const graphQLServer = express();

graphQLServer.use('/graphql', apolloServer({ schema: schema, graphiql: true }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));
