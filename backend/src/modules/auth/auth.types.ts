import type { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AuthResponseDTO {
  message: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}