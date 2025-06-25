import { NextFunction, Response } from "express";
import { StudyGroupModel } from "../models/study-group.model";
import { AuthRequest } from "../types/auth.types";
import { ApiError } from "../utils/response.utils";

export const requireGroupAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  const userId = req.user?.uid;
  if (!userId) {
    return next(new ApiError(401, "User not authenticated"));
  }
  const group = await StudyGroupModel.findById(groupId).populate("members.user", "uid");
  if (!group) {
    return next(new ApiError(404, "Group not found"));
  }
  const isAdmin = group.members.some(
    (m) => m.role === "admin" && m.user && (m.user as any).uid === userId
  );
  if (!isAdmin) {
    return next(new ApiError(403, "Only group admins can perform this action"));
  }
  next();
};
