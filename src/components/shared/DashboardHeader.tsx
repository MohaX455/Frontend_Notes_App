"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { Logo, Button } from "@/components/ui";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
    onOpenMenu: () => void;
}

export const DashboardHeader = ({ onOpenMenu }: DashboardHeaderProps) => {
    const { user } = useAuthStore();
    const { logout } = useAuth();

    return (
        <header className="sticky top-0 z-20 border-b border-muted/10 bg-surface/95 backdrop-blur-md">
            <div className="mx-auto flex items-center justify-between gap-4 p-4">
                <Link href="/workspaces" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Logo />
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenMenu}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-muted/15 bg-white text-primary shadow-sm transition hover:bg-surface lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="hidden items-center gap-6 lg:flex">
                        <span className="text-lg font-medium text-primary truncate max-w-[180px]">
                            {user?.username}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="text-red-600 border-red-200 hover:bg-red-50 focus:ring-red-500"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
