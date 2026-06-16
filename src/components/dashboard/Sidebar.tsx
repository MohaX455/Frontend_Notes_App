"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Folders, Plus, Menu, X } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Logo, Button } from "@/components/ui";
import { UserMenu } from "@/components/shared/UserMenu";
import { WorkspaceItem } from "./WorkspaceItem";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: workspaces = [], isLoading } = useWorkspaces();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-muted/10">
                <Logo />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                {/* Main Navigation */}
                <div className="mb-8">
                    <Link
                        href="/workspaces"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive("/workspaces")
                                ? "bg-accent/10 text-accent border border-accent/20"
                                : "text-muted hover:text-primary hover:bg-surface border border-surface"
                        )}
                    >
                        <Folders className="w-5 h-5" />
                        Workspaces
                    </Link>
                </div>

                {/* Workspaces List */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm pl-3 font-semibold text-primary uppercase tracking-wider">
                            Workspaces
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-accent/10"
                            onClick={() => router.push("/workspaces/new")}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-8 bg-muted/20 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : workspaces.length === 0 ? (
                        <p className="text-xs pl-3 text-muted">No workspaces yet</p>
                    ) : (
                        workspaces.map((workspace) => (
                            <WorkspaceItem
                                key={workspace.id}
                                workspace={workspace}
                                isActive={isActive(`/workspaces/${workspace.id}`)}
                            />
                        ))
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-muted/10">
                <UserMenu />
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-lg border border-muted/20 shadow-sm"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:h-screen lg:border-r lg:border-muted/10 lg:bg-surface lg:z-30",
                className
            )}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Sidebar */}
                    <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-surface border-r border-muted/10 z-50 transform transition-transform duration-200 ease-in-out">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 rounded-lg hover:bg-muted/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </>
            )}
        </>
    );
};