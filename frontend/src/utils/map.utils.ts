import type { ApiUser, User } from "../types/auth.type";

export const mapApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser._id,
    name: apiUser.name,
    email: apiUser.email,
    avatar: apiUser.picture,
    uid: apiUser.uid,
  };
};
