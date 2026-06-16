"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "./useAuth";

/**
 * Hook to automatically refresh authentication tokens at regular intervals
 * to prevent user from being logged out due to token expiration.
 */
export const useTokenRefresh = () => {
    const { refreshToken } = useAuth();
    const { isAuthenticated, accessToken } = useAuthStore();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Only start refresh interval if user is authenticated and has access token
        if (!isAuthenticated || !accessToken) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Refresh token every 5 minutes (300 seconds)
        // This is much shorter than typical token expiration (usually 15-30 minutes)
        // to ensure we refresh before expiration
        const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

        const startRefreshInterval = () => {
            intervalRef.current = setInterval(async () => {
                try {
                    await refreshToken();
                } catch (error) {
                    // Error is already handled in useAuth.refreshToken
                    // It will redirect to login if refresh fails
                    console.warn("Token refresh failed:", error);
                }
            }, REFRESH_INTERVAL);
        };

        startRefreshInterval();

        // Cleanup interval on unmount or when authentication changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAuthenticated, accessToken, refreshToken]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
};