"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
    initials: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ initials, size = "md", className }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-center rounded-lg bg-accent text-white font-semibold leading-none",
                    sizeMap[size],
                    className
                )}
            >
                {initials.toUpperCase()}
            </div>
        );
    }
);

Avatar.displayName = "Avatar";
