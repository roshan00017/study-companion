import { GroupRole, StudyGroupModel } from "../models/study-group.model";
import { UserModel } from "../models/user.model";
import mongoose from "mongoose";

class StudyGroupService {
  async createStudyGroup(
    name: string,
    description: string,
    creatorUid: string
  ) {
    const user = await UserModel.findOne({ uid: creatorUid });
    if (!user) throw new Error("User not found");
    const group = await StudyGroupModel.create({
      name,
      description,
      createdBy: user._id,
      members: [{ user: user._id, role: "admin" }],
    });
    return group;
  }

  async addUserToGroup(groupId: string, userId: string, role: GroupRole) {
    const group = await StudyGroupModel.findById(groupId);
    if (!group) throw new Error("Group not found");
    if (group.members.some((m) => m.user.toString() === userId)) {
      throw new Error("User already in group");
    }
    group.members.push({ user: new mongoose.Types.ObjectId(userId), role });
    await group.save();
    return group;
  }

  async removeUserFromGroup(groupId: string, userId: string) {
    const group = await StudyGroupModel.findById(groupId);
    if (!group) throw new Error("Group not found");
    group.members = group.members.filter((m) => m.user.toString() !== userId);
    await group.save();
    return group;
  }

  async getGroupsForUser(uid: string) {
    const user = await UserModel.findOne({ uid });
    if (!user) throw new Error("User not found");
    const groups = await StudyGroupModel.find({ "members.user": user._id });
    return groups;
  }

  async getGroupMembers(groupId: string) {
    const group = await StudyGroupModel.findById(groupId).populate(
      "members.user",
      "name email picture uid"
    );
    if (!group) throw new Error("Group not found");
    return group.members;
  }
}

export const studyGroupService = new StudyGroupService();
