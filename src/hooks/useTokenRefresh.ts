"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "./useAuth";

const parseJwtPayload = (token: string) => {
    try {
        const [, payload] = token.split(".");
        if (!payload) {
            return null;
        }

        const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
        const decoded = window.atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

const getTokenExpiryTime = (token: string | null) => {
    if (!token) {
        return 0;
    }

    const payload = parseJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") {
        return 0;
    }

    return payload.exp * 1000;
};

export const useTokenRefresh = () => {
    const { refreshToken: refreshSession } = useAuth();
    const { isAuthenticated, accessToken } = useAuthStore();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const refreshIfNeeded = async () => {
            const expiryTime = getTokenExpiryTime(accessToken);
            const refreshBufferMs = 60_000;
            const shouldRefresh = expiryTime > 0 && expiryTime - Date.now() <= refreshBufferMs;

            if (!shouldRefresh) {
                return;
            }

            try {
                await refreshSession();
            } catch (error) {
                console.warn("Token refresh failed:", error);
            }
        };

        void refreshIfNeeded();

        const REFRESH_INTERVAL = 30_000;
        intervalRef.current = setInterval(() => {
            void refreshIfNeeded();
        }, REFRESH_INTERVAL);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isAuthenticated, accessToken, refreshSession]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);
};
