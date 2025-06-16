import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { AuthRequest } from "../types";
import { sendError, sendSuccess } from "../utils/response.utils";
import admin from "../config/firebase-admin.config";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      console.log("Received ID Token:", idToken);

      if (!idToken) {
        sendError(res, "ID token is required", 400);
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
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      sendSuccess(res, "Login successful", user);
    } catch (error) {
      console.error("Login error:", error);
      sendError(res, "Invalid ID token", 401);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendSuccess(res, "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      sendError(res, "Logout failed", 500);
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      const user = await UserModel.findOne({ uid: req.user?.uid }).select(
        "-_id -__v"
      );

      if (!user) {
        sendError(res, "User not found", 404);
      }

      sendSuccess(res, "User fetched successfully", user);
    } catch (error) {
      console.error("Error fetching user:", error);
      sendError(res, "Internal server error", 500);
    }
  }
}

export default new AuthController();
