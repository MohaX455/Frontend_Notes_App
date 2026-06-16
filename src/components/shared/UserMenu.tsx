"use client";

import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import {
    useFloating,
    useClick,
    useDismiss,
    useInteractions,
    FloatingPortal,
    offset,
    flip,
    shift,
} from "@floating-ui/react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export const UserMenu = () => {
    const { user } = useAuthStore();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "top-start",
        middleware: [offset(8), flip(), shift({ padding: 8 })],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
    };

    if (!user) return null;

    const initials = user.username
        .split(" ")
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    isOpen ? "bg-muted/10" : "hover:bg-muted/10"
                )}
            >
                <Avatar initials={initials} size="sm" />
                <span className="flex-1 truncate text-sm font-medium text-primary">
                    {user.username}
                </span>
            </div>

            {isOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={{
                            ...floatingStyles,
                            minWidth: refs.reference.current
                                ? (refs.reference.current as HTMLElement).offsetWidth
                                : undefined,
                        }}
                        {...getFloatingProps()}
                        className="z-[9999] bg-primary-foreground border border-muted/15 shadow-md rounded-lg py-1"
                    >
                        {/* User info header */}
                        <div className="px-3 py-2 border-b border-muted/10 mb-1">
                            <p className="text-xs text-muted truncate">{user.email}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm text-primary",
                                "hover:bg-muted/10 transition-colors flex items-center gap-2"
                            )}
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm text-primary",
                                "hover:bg-muted/10 transition-colors flex items-center gap-2"
                            )}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>

                        <div className="h-px bg-muted/10 my-1" />

                        <button
                            type="button"
                            onClick={handleLogout}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm text-red-600",
                                "hover:bg-red-50 transition-colors flex items-center gap-2"
                            )}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};