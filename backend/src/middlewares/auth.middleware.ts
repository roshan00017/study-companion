import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { admin } from "../config";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
interface uAuthRequest extends Request {
  uid?: string;
  email?: string;
}

export const verifyFirebaseToken = async (
  req: uAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.uid = decodedToken.uid;
    req.email = decodedToken.email;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error });
  }
};
