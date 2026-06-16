"use client";

import { ReactNode, createContext, useCallback, useContext, useState } from "react";
import {
    useFloating,
    useClick,
    useDismiss,
    useInteractions,
    FloatingPortal,
    offset,
    flip,
    shift,
    Placement,
} from "@floating-ui/react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
    placement?: Placement;
    onOpenChange?: (isOpen: boolean) => void;
}

interface DropdownMenuContextValue {
    close: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);
const useDropdownMenuContext = () => {
    const context = useContext(DropdownMenuContext);
    if (!context) {
        throw new Error("DropdownMenuItem must be used inside a DropdownMenu.");
    }
    return context;
};

export const DropdownMenu = ({
    trigger,
    children,
    className,
    placement = "bottom-end",
    onOpenChange,
}: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const close = useCallback(() => {
        setIsOpen(false);
        onOpenChange?.(false);
    }, [onOpenChange]);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: (value) => {
            setIsOpen(value);
            onOpenChange?.(value);
        },
        placement,
        middleware: [offset(8), flip(), shift({ padding: 8 })],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    return (
        <DropdownMenuContext.Provider value={{ close }}>
            <div ref={refs.setReference} {...getReferenceProps()}>
                {trigger}
            </div>

            {isOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className={cn(
                            "z-[9999] min-w-48 bg-primary-foreground border border-muted/15 shadow-xl rounded-lg py-1",
                            className
                        )}
                    >
                        {children}
                    </div>
                </FloatingPortal>
            )}
        </DropdownMenuContext.Provider>
    );
};

interface DropdownMenuItemProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    closeOnSelect?: boolean;
}

export const DropdownMenuItem = ({
    children,
    onClick,
    className,
    disabled,
    closeOnSelect = true,
}: DropdownMenuItemProps) => {
    const { close } = useDropdownMenuContext();

    const handleClick = () => {
        if (disabled) {
            return;
        }

        onClick?.();

        if (closeOnSelect) {
            close();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "w-full text-left px-3 py-2 text-sm text-primary",
                "hover:bg-muted/10 transition-colors flex items-center gap-2",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {children}
        </button>
    );
};