import { PrismaClient } from "@prisma/client";
import { PrismaContext } from "./types/model";

const primsa = new PrismaClient();

export const _dbContext: PrismaContext = {
    prisma : primsa
} 