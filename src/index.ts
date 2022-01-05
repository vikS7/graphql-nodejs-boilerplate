import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolvers } from './modules/user/resolvers';
import cors from 'cors';
import { createContext } from './utils/context';


(async () => {
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolvers]
        }),
        context : createContext
    });
    
    app.use(cors());

    await apolloServer.start();
    apolloServer.applyMiddleware({app});
    app.listen(4000, () => {
        console.log("Server started");
    })
})()
