import jwt from 'jsonwebtoken';

export const generateAuthToken = async (userId: string) => {
    return await jwt.sign({userId: userId}, process.env.SECRET_KEY!);
}