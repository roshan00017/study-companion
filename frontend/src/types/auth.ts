export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatar: string;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (userData: User) => void;
};
