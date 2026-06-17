"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "auto";
            return;
        }

        document.body.style.overflow = "hidden";

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className={cn(
                    "bg-surface border border-muted/15 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
                    className
                )}
            >
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-muted/10">
                        <h2 className="text-lg font-semibold text-primary">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-muted/10 transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-muted" />
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
};
