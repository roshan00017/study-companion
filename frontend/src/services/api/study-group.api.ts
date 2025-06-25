import api from "../api";

// Create a study group
type CreateGroupPayload = {
  name: string;
  description?: string;
};

export const createStudyGroup = async (data: CreateGroupPayload) => {
  const res = await api.post("/study-groups", data);
  return res.data.data;
};

// List groups for the authenticated user
export const getUserStudyGroups = async () => {
  const res = await api.get("/study-groups");
  return res.data.data;
};

// List members of a group
export const getGroupMembers = async (groupId: string) => {
  const res = await api.get(`/study-groups/${groupId}/members`);
  return res.data.data;
};

// Add a user to a group (admin only)
export const addUserToGroup = async (groupId: string, userId: string, role: string) => {
  const res = await api.post(`/study-groups/${groupId}/members`, { userId, role });
  return res.data.data;
};

// Remove a user from a group (admin only)
export const removeUserFromGroup = async (groupId: string, userId: string) => {
  const res = await api.delete(`/study-groups/${groupId}/members/${userId}`);
  return res.data.data;
};
