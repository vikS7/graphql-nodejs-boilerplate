import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AuthResponse, User } from "./model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAuthToken } from "../../utils/helper";
import { isAuthenticated } from "../../middleware/auth";
import { MiddlewareContext } from "../../utils/types/model";

@Resolver()
export class UserResolvers{

    @Mutation(() => AuthResponse)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("name") name: string,
        @Ctx() context: MiddlewareContext
    ): Promise<AuthResponse>{
        const hashedPassword = await bcrypt.hash(password, 12);
        try{
            const user = await context.prisma.user.create({
                data: {
                    email : email,
                    name: name,
                    password: hashedPassword
                }
            });
            const token = await jwt.sign({userId: user.id}, "secretkey");
            
            return {
                user,
                token
            }
        }catch(err) {
            console.log(err);
            throw new Error(err);
        } 
    }

    @Mutation(() => AuthResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: MiddlewareContext
    ){
        const user = await context.prisma.user.findUnique({
            where: {
                email : email
            }
        });

        if(!user){
            throw new Error("Invalid Email");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error("Invalid Password");
        }

        const token = await generateAuthToken(user.id);

        return {
            user: user,
            token: token
        }
    }

    @Query(() => User)
    @UseMiddleware(isAuthenticated)
    async getUserById(
        @Arg("userId") userId: string,
        @Ctx() context: MiddlewareContext
    ){
        const user = await context.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if(!user){
            throw new Error("No such user exists");
        }

        return user;
    }

    @Query(() => User)
    @UseMiddleware(isAuthenticated)
    async getLoggedInUser(
        @Ctx() {user}: MiddlewareContext
    ){
        return user;
    }
}