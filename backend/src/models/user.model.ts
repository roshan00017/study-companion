import mongoose from "mongoose";

export interface IUser {
  uid: string;
  email: string;
  name: string;
  picture?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
