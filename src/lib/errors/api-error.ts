"use client";

import { AxiosError } from "axios";

export interface AppError {
    message: string;
    statusCode?: number;
    code?: string;
    details?: string[];
    fieldErrors?: Record<string, string>;
}

interface BackendErrorPayload {
    detail?:
        | string
        | { msg?: string; loc?: Array<string | number> }
        | Array<{ msg?: string; loc?: Array<string | number> }>;
    message?: string;
    code?: string;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const STATUS_MESSAGE_MAP: Record<number, string> = {
    400: "Your request is invalid. Please review your input and try again.",
    401: "Your session has expired. Please sign in again.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "This action conflicts with existing data.",
    422: "Some fields are invalid. Please review and try again.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "A server error occurred. Please try again shortly.",
    502: "The service is temporarily unavailable. Please try again shortly.",
    503: "The service is temporarily unavailable. Please try again shortly.",
    504: "The request timed out. Please try again.",
};

const normalizeBackendDetail = (detail: BackendErrorPayload["detail"]): string[] => {
    if (!detail) {
        return [];
    }

    if (typeof detail === "string") {
        return [detail];
    }

    if (Array.isArray(detail)) {
        return detail
            .map((item) => item.msg?.trim())
            .filter((value): value is string => Boolean(value));
    }

    if (typeof detail === "object" && detail.msg) {
        return [detail.msg];
    }

    return [];
};

const normalizeFieldErrors = (
    detail: BackendErrorPayload["detail"]
): Record<string, string> | undefined => {
    if (!Array.isArray(detail)) {
        return undefined;
    }

    const fieldErrors: Record<string, string> = {};

    for (const item of detail) {
        const message = item.msg?.trim();
        const loc = item.loc;

        if (!message || !Array.isArray(loc) || loc.length === 0) {
            continue;
        }

        const fieldPath = loc
            .filter((segment) => segment !== "body")
            .map((segment) => String(segment))
            .join(".");

        if (!fieldPath) {
            continue;
        }

        if (!fieldErrors[fieldPath]) {
            fieldErrors[fieldPath] = message;
        }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

export const normalizeApiError = (error: unknown): AppError => {
    if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const payload = error.response?.data as BackendErrorPayload | undefined;
        const backendDetails = normalizeBackendDetail(payload?.detail);
        const fieldErrors = normalizeFieldErrors(payload?.detail);
        const payloadMessage = payload?.message?.trim();
        const rawMessage = backendDetails[0] || payloadMessage;
        const fallbackByStatus = statusCode ? STATUS_MESSAGE_MAP[statusCode] : undefined;

        return {
            message: rawMessage || fallbackByStatus || error.message || DEFAULT_ERROR_MESSAGE,
            statusCode,
            code: payload?.code,
            details: backendDetails.length > 1 ? backendDetails : undefined,
            fieldErrors,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message || DEFAULT_ERROR_MESSAGE,
        };
    }

    return {
        message: DEFAULT_ERROR_MESSAGE,
    };
};

