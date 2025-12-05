import { create } from "zustand";

// Helper functions to access localStorage safely
const getItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setItem = (key: string, value: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {}
};

export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  resetAuth: () => void;
};

// Get initial tokens from localStorage (if any)
const initialAccessToken =
  typeof window !== "undefined" ? getItem("accessToken") : null;
const initialRefreshToken =
  typeof window !== "undefined" ? getItem("refreshToken") : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,

  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
    setItem("accessToken", accessToken);
    setItem("refreshToken", refreshToken);
  },
  resetAuth: () => {
    set({ user: null, accessToken: null, refreshToken: null });
    setItem("accessToken", null);
    setItem("refreshToken", null);
  },
}));
