"use client";

import { create } from "zustand";
import { User } from "@/types";

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    setIsLoading: (isLoading: boolean) => void;
    hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user) => {
        set({ user });
    },

    setAccessToken: (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", token);
            // Keep middleware cookie aligned with refreshed access token.
            document.cookie = `accessToken=${token}; path=/; max-age=86400; samesite=strict`;
        }
        set({ accessToken: token });
    },

    setRefreshToken: (token) => {
        set({ refreshToken: token });
    },

    setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);
            // Set cookie for middleware
            document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; samesite=strict`;
        }
        set({
            user,
            accessToken,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
        });
    },

    clearAuth: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            // Clear client-side access token cookie with matching attributes.
            document.cookie =
                "accessToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
        }
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    setIsLoading: (isLoading) => {
        set({ isLoading });
    },

    hydrateFromStorage: () => {
        if (typeof window === "undefined") return;

        const accessToken = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");

        let user: User | null = null;
        if (userStr) {
            try {
                user = JSON.parse(userStr);
            } catch {
                // Invalid JSON, ignore
            }
        }

        // Mark loading as complete
        if (accessToken && user) {
            set({
                user,
                accessToken,
                refreshToken: null,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            set({ isLoading: false });
        }
    },
}));
