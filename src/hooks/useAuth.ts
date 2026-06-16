"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/lib/auth/auth.service";
import { LoginRequest, RegisterRequest } from "@/types";
import { presentError } from "@/lib/errors/error-presenter";

export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const login = useCallback(
        async (data: LoginRequest) => {
            try {
                const { token, user } = await AuthService.login(data);
                AuthService.setAuthData(user, token.access_token);
                queryClient.clear();
                router.push("/workspaces");
            } catch (error) {
                throw error;
            }
        },
        [router, queryClient]
    );

    const register = useCallback(
        async (data: RegisterRequest) => {
            try {
                const result = await AuthService.register(data);
                router.push("/login");
                return result;
            } catch (error) {
                throw error;
            }
        },
        [router]
    );

    const logout = useCallback(
        async () => {
            try {
                await AuthService.logout();
            } catch (error) {
                presentError(error, { title: "Logout failed" });
            } finally {
                queryClient.clear();
                AuthService.clearAuth();
                router.replace("/login");
            }
        },
        [router, queryClient]
    );

    const refreshToken = useCallback(
        async () => {
            try {
                const { token } = await AuthService.refreshToken();
                // Access token is already updated in the service
                return token.access_token;
            } catch (error) {
                queryClient.clear();
                AuthService.clearAuth();
                router.push("/login");
                throw error;
            }
        },
        [router, queryClient]
    );

    return {
        login,
        register,
        logout,
        refreshToken,
    };
};
