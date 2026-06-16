"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { Logo, Button } from "@/components/ui";

export const DashboardHeader = () => {
    const { user } = useAuthStore();
    const { logout } = useAuth();

    return (
        <header className="border-b border-muted/20 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/workspaces" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>

                <div className="flex items-center gap-6">
                    <span className="text-sm text-primary-foreground/80">
                        {user?.email}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};
