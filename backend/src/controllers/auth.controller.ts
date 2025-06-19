import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../types";
import { ApiError, sendSuccess } from "../utils/response.utils";
import admin from "../config/firebase-admin.config";
import { UserModel } from "../models";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        throw new ApiError(400, "ID token is required");
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decoded;

      const user = await UserModel.findOneAndUpdate(
        { uid },
        { uid, email, name, picture },
        { upsert: true, new: true }
      );

      const jwtPayload = { uid, email };
      const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      res.clearCookie("token");
      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, "Login successful", user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendSuccess(res, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findOne({ uid: req.user?.uid }).select(
        "-_id -__v"
      );

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      sendSuccess(res, "User fetched successfully", user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
