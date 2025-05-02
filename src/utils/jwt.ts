import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { Types } from 'mongoose';
import type { StringValue } from 'ms';

interface TokenPayload {
  userId: string | Types.ObjectId;
  email: string;
}

export const generateAccessToken = (userId: string | Types.ObjectId, email: string): string => {
  return jwt.sign(
    { userId, email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRY as StringValue }
  );
};

export const generateRefreshToken = (userId: string | Types.ObjectId, email: string): string => {
  return jwt.sign(
    { userId, email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRY as StringValue }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch (error: any) {
    // Provide more specific error messages based on the type of error
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token format');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not yet active');
    } else {
      throw new Error('Invalid token');
    }
  }
};