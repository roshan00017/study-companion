import { Request, Response } from "express";
import { admin } from "../config"; // your firebase admin import
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({ message: "ID token is required" });
        return;
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decoded;

      await UserModel.findOneAndUpdate(
        { uid },
        { uid, email, name, picture },
        { upsert: true, new: true }
      );

      const jwtPayload = { uid, email };
      const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login successful" });
      return;
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: "Invalid ID token" });
      return;
    }
  }

  async logout(_: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
    return;
  }

  async me(req: Request, res: Response) {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });

      return;
    }

    const dbUser = await UserModel.findOne({ uid: user.uid }).select(
      "-_id -__v"
    );

    if (!dbUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(dbUser);
    return;
  }
}
export default new AuthController();
