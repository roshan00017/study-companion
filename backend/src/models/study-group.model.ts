import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export type GroupRole = "admin" | "member";

export interface IStudyGroupMember {
  user: Types.ObjectId; // Reference to User
  role: GroupRole;
}

export interface IStudyGroup {
  name: string;
  description?: string;
  createdBy: Types.ObjectId; // Reference to User
  members: IStudyGroupMember[];
  createdAt?: Date;
  updatedAt?: Date;
}

const studyGroupMemberSchema = new Schema<IStudyGroupMember>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "member"], required: true },
});

const studyGroupSchema = new Schema<IStudyGroup>(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: { type: [studyGroupMemberSchema], required: true },
  },
  { timestamps: true }
);

export const StudyGroupModel = mongoose.model<IStudyGroup>("StudyGroup", studyGroupSchema);
