import * as jwt from 'jsonwebtoken';

export const SIGN_KEY = process.env.SIGN_KEY || '';

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
