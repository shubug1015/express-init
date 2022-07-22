import { access } from 'fs';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export const SIGN_KEY = process.env.SIGN_KEY || '';
const prisma = new PrismaClient();

export interface AuthTokenPayload {
  userId: number;
}

export const decodeAuthHeader = (authHeader: String): AuthTokenPayload => {
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token found');
  }
  return jwt.verify(token, SIGN_KEY) as AuthTokenPayload;
};

export const decodeToken = async (token: string) => {
  try {
    const {userId} = jwt.verify(token, SIGN_KEY) as {[key:string] : any};
    return { isValid: true, id: userId };
  } catch {
    return { isValid: false, id: null };
  }
};

//RefreshToken 검사 후, 만료되지 않았으면 AccessToken 발급, 만료되었다면, RefreshToken& AccessToken 발금
export const remakeToken = async (token: string) => {
  try{  //RefreshToken 검사 --> 유효하다면
    const RefreshValid = jwt.verify(token, SIGN_KEY) as {[key:string]: any};
   
    const user = await prisma.user.findUnique({
      where: { id: RefreshValid.userId },
    });
    //존재하지 않는 사용자
    if(!user) return { Refresh : false}

    //사용자가 존재하고, RefreshToken이 유효하면, AccessToken 재발급
    const accessToken = jwt.sign({ userId: user.id }, SIGN_KEY, {
      expiresIn: "30s", // 30초
    });

    return {accessToken, Refresh: true};
  }
  catch // 만료된 RefreshToken인경우, 
  {
    return {Refresh: false};
  }
}
