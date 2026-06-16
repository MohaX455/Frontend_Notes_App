"use client";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/stores/auth.store";
import {
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
    RegisterRequest,
    RegisterResponse,
    User
} from "@/types";

export class AuthService {
    static async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials);
        return response.data;
    }

    static async register(userData: RegisterRequest): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>(API_ENDPOINTS.auth.register, userData);
        return response.data;
    }

    static async logout(): Promise<LogoutResponse> {
        const response = await apiClient.post<LogoutResponse>(API_ENDPOINTS.auth.logout);
        return response.data;
    }

    static async refreshToken(): Promise<RefreshResponse> {
        const response = await apiClient.post<RefreshResponse>(API_ENDPOINTS.auth.refresh);
        return response.data;
    }

    static async getCurrentUser(): Promise<User> {
        const response = await apiClient.get(API_ENDPOINTS.auth.me);
        return response.data;
    }

    static setAuthData(user: User, accessToken: string, refreshToken = "") {
        const store = useAuthStore.getState();

        // Use setAuth to properly set isAuthenticated flag
        store.setAuth(user, accessToken, refreshToken);
        store.setIsLoading(false);

        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }

    static clearAuth() {
        const store = useAuthStore.getState();
        store.clearAuth();

        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    }
}