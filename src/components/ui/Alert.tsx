import React from "react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "error" | "success" | "info" | "warning";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, type = "info", children, ...props }, ref) => {
        const typeStyles = {
            error: "bg-red-50 border-red-200 text-red-800",
            success: "bg-green-50 border-green-200 text-green-800",
            info: "bg-blue-50 border-blue-200 text-blue-800",
            warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "px-4 py-3 rounded-lg border text-sm",
                    typeStyles[type],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Alert.displayName = "Alert";
