declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
        picture?: string;
        [key: string]: any;
      };
    }
  }
}

export {};
