import { Request } from "express";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthRequest<T = unknown> extends Request {
  user?: AuthenticatedUser;
  body: T;
}
