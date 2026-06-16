"use client";

import { useEffect } from "react";
import { XCircle, CheckCircle2, Info, X } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";
import { cn } from "@/lib/utils";

const AUTO_DISMISS_MS = 6000;

const typeStyles = {
    error: {
        icon: XCircle,
        className: "border-red-200 bg-red-50 text-red-900",
    },
    success: {
        icon: CheckCircle2,
        className: "border-green-200 bg-green-50 text-green-900",
    },
    info: {
        icon: Info,
        className: "border-blue-200 bg-blue-50 text-blue-900",
    },
} as const;

export const NotificationToast = () => {
    const { notifications, removeNotification } = useNotificationStore();

    useEffect(() => {
        if (notifications.length === 0) {
            return;
        }

        const timers = notifications.map((notification) =>
            setTimeout(() => {
                removeNotification(notification.id);
            }, AUTO_DISMISS_MS)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [notifications, removeNotification]);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-[10000] flex w-full max-w-sm flex-col gap-3">
            {notifications.map((notification) => {
                const style = typeStyles[notification.type];
                const Icon = style.icon;

                return (
                    <div
                        key={notification.id}
                        className={cn(
                            "pointer-events-auto rounded-lg border p-4 shadow-md backdrop-blur-sm",
                            style.className
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">{notification.title}</p>
                                <p className="mt-1 text-sm leading-5">{notification.message}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeNotification(notification.id)}
                                className="rounded p-1 transition-colors hover:bg-black/5"
                                aria-label="Dismiss notification"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

