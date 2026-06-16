"use client";

import { create } from "zustand";

export type NotificationType = "error" | "success" | "info";

export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
}

interface NotificationStore {
    notifications: NotificationItem[];
    pushNotification: (item: Omit<NotificationItem, "id">) => string;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

const createNotificationId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    pushNotification: (item) => {
        const id = createNotificationId();
        set((state) => ({
            notifications: [...state.notifications, { ...item, id }],
        }));
        return id;
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((notification) => notification.id !== id),
        }));
    },
    clearNotifications: () => {
        set({ notifications: [] });
    },
}));

