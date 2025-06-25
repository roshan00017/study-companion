import { Response, NextFunction } from "express";
import { sendSuccess, ApiError } from "../utils/response.utils";
import { studyGroupService } from "../service/study-group.service";
import { AuthRequest } from "../types/auth.types";

class StudyGroupController {
  async createStudyGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body as any;
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }
      const group = await studyGroupService.createStudyGroup(
        name,
        description,
        userId
      );
      sendSuccess(res, "Study group created successfully", group, 201);
    } catch (error) {
      next(error);
    }
  }

  async addUserToGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const { userId, role } = req.body as any;
      if (!userId || !role) {
        throw new ApiError(400, "userId and role required");
      }
      const group = await studyGroupService.addUserToGroup(
        groupId,
        userId,
        role
      );
      sendSuccess(res, "User added to group", group);
    } catch (error) {
      next(error);
    }
  }

  async removeUserFromGroup(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { groupId, userId } = req.params;
      const group = await studyGroupService.removeUserFromGroup(
        groupId,
        userId
      );
      sendSuccess(res, "User removed from group", group);
    } catch (error) {
      next(error);
    }
  }

  async getGroupsForUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }
      const groups = await studyGroupService.getGroupsForUser(userId);
      sendSuccess(res, "Groups fetched successfully", groups);
    } catch (error) {
      next(error);
    }
  }

  async getGroupMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;
      const members = await studyGroupService.getGroupMembers(groupId);
      sendSuccess(res, "Group members fetched successfully", members);
    } catch (error) {
      next(error);
    }
  }
}

export default new StudyGroupController();
