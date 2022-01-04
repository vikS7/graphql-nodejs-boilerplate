import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

export interface PrismaContext {
    prisma : PrismaClient
}

export interface MiddlewareContext {
    req: Request;
    res: Response;
    user: User
}