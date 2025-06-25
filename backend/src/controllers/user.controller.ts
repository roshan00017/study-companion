import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { sendSuccess, ApiError } from "../utils/response.utils";

class UserController {
  async searchUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        throw new ApiError(400, "Email query parameter is required");
      }
      const user = await UserModel.findOne({ email: { $regex: `^${email}$`, $options: "i" } }).select("_id uid email name picture");
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      sendSuccess(res, "User found", user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
