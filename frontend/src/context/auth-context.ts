import { createContext } from "react";
import type { User } from "../types/user";

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHandle: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
