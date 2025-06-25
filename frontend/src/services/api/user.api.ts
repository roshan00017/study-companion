import api from "../api";

export const searchUserByEmail = async (email: string) => {
  const res = await api.get(`/users/search?email=${encodeURIComponent(email)}`);
  return res.data.data;
};
