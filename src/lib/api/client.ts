"use client";

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { useAuthStore } from "@/stores/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const isAuthEndpoint = (url?: string) => {
    if (!url) {
        return false;
    }

    return [
        API_ENDPOINTS.auth.login,
        API_ENDPOINTS.auth.register,
        API_ENDPOINTS.auth.refresh,
        API_ENDPOINTS.auth.logout,
    ].some((endpoint) => url.includes(endpoint));
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${API_ENDPOINTS.auth.refresh}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const newAccessToken = response.data?.token?.access_token;

            if (!newAccessToken) {
                throw new Error("No access token returned by refresh endpoint");
            }

            useAuthStore.getState().setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (error) {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("auth:refresh-failed"));
            }
            throw error;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor - add access token to Authorization header
    client.interceptors.request.use(
        (config) => {
            const accessToken = useAuthStore.getState().accessToken;
            const isAuthRequest = isAuthEndpoint(config.url);

            if (accessToken && !isAuthRequest) {
                config.headers = config.headers ?? {};
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor - handle 401 and refresh token
    client.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryableRequestConfig | undefined;

            // Only retry once and only on 401 for non-auth endpoints
            if (
                error.response?.status === 401 &&
                originalRequest &&
                !originalRequest._retry &&
                !isAuthEndpoint(originalRequest.url) &&
                useAuthStore.getState().isAuthenticated
            ) {
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshAccessToken();

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    return client(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return client;
};

export const apiClient = createApiClient();
