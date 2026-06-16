"use client";

import { AxiosError } from "axios";
import { normalizeApiError } from "./api-error";
import { useNotificationStore } from "@/stores/notification.store";

interface PresentErrorOptions {
    title?: string;
}

export const presentError = (error: unknown, options: PresentErrorOptions = {}) => {
    if (error instanceof AxiosError && error.config?.url?.includes("/auth/refresh")) {
        return normalizeApiError(error);
    }

    const normalized = normalizeApiError(error);
    useNotificationStore.getState().pushNotification({
        type: "error",
        title: options.title || "Request failed",
        message: normalized.message,
    });
    return normalized;
};

