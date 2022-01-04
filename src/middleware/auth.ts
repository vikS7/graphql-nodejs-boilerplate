import { MiddlewareContext } from "../utils/types/model";
import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { _dbContext } from "../utils/context";
import { AuthenticationError } from "apollo-server-express";

type PayloadToken = {
    userId: string;
}

export const isAuthenticated: MiddlewareFn<MiddlewareContext> = async ({context}, next) => {
    const authorization = context.req.headers.authorization;

    if(!authorization){
        throw new AuthenticationError("Not authenticated");
    }

    const authToken = authorization?.replace("Bearer ", "");

    try{
        const payload = verify(authToken, process.env.SECRET_KEY!) as PayloadToken;
        const userId = payload.userId;

        const user = await _dbContext.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        
        if(!user){
            throw new AuthenticationError("Invalid Token");
        }

        context.user = user;

        return next();

    }catch(e){
        throw e;
    }
}