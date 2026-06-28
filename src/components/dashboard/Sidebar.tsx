"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Folders, Plus, X } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Logo, Button } from "@/components/ui";
import { UserMenu } from "@/components/shared/UserMenu";
import { WorkspaceItem } from "./WorkspaceItem";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ className, isOpen = false, onClose = () => { } }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: workspaces = [], isLoading } = useWorkspaces();

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
                        onClick={() => onClose?.()}
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
                            onClick={() => {
                                onClose?.();
                                router.push("/workspaces/new");
                            }}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 custom-scrollbar">
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
                                    onNavigate={onClose}
                                />
                            ))
                        )}
                    </div>
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
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:h-screen lg:border-r lg:border-muted/10 lg:bg-surface lg:z-30",
                className
            )}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-surface border-r border-muted/10 z-50 transform transition-transform duration-200 ease-in-out">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={onClose}
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