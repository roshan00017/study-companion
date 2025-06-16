export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  uid: string;
}

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  picture: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
