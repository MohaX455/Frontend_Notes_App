"use client";

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { useAuthStore } from "@/stores/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
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
            if (accessToken) {
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

            // Only retry once and only on 401
            if (
                error.response?.status === 401 &&
                originalRequest &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                try {
                    // Attempt to refresh the token (cookie will be sent automatically)
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

                    const newAccessToken = response.data.token.access_token;

                    // Update the store with new access token
                    useAuthStore.getState().setAccessToken(newAccessToken);

                    // Update the authorization header for the original request
                    if (originalRequest) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    // Retry the original request with new token
                    return client(originalRequest);
                } catch (refreshError) {
                    // Refresh failed - clear auth and redirect to login
                    console.warn("Token refresh failed, clearing authentication:", refreshError);
                    useAuthStore.getState().clearAuth();
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return client;
};

export const apiClient = createApiClient();
