import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-surface-foreground mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full px-3 py-2.5 bg-surface border rounded-lg text-surface-foreground placeholder:text-muted transition-colors duration-200",
                        error
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-muted focus:border-accent focus:ring-2 focus:ring-accent/10",
                        "focus:outline-none",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
