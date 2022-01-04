import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User{

    @Field()
    id: string
    
    @Field()
    name: String

    @Field()
    email: String    
}

@ObjectType()
export class AuthResponse{
    
    @Field(() => User)
    user: User

    @Field()
    token: String
}