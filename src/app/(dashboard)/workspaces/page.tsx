"use client";

import { useRouter } from "next/navigation";
import { Plus, Folder } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function WorkspacesPage() {
    const router = useRouter();
    const { data: workspaces = [], isLoading } = useWorkspaces();

    const navigateToNewWorkspace = () => {
        router.push("/workspaces/new");
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted/20 rounded-lg w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-muted/20 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary mb-2">
                        Workspaces
                    </h1>
                    <p className="text-muted max-w-2xl">
                        Organize your notes and ideas in dedicated workspaces with a cleaner, more flexible layout.
                    </p>
                </div>

                {workspaces.length > 0 && (
                    <Button onClick={navigateToNewWorkspace} className="inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Workspace
                    </Button>
                )}
            </div>

            {/* Workspaces Grid */}
            {workspaces.length === 0 ? (
                <div className="text-center py-16">
                    <Folder className="mx-auto mb-4 h-16 w-16 text-muted/40" />
                    <h3 className="text-xl font-semibold text-primary mb-2">
                        No workspaces yet
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-muted">
                        Create your first workspace to start organizing your notes and ideas.
                    </p>
                    <Button onClick={navigateToNewWorkspace} className="inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Workspace
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => router.push(`/workspaces/${workspace.id}`)}
                            className={cn(
                                "cursor-pointer overflow-hidden rounded-lg border border-muted/10 bg-surface p-6 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/10 md:hover:-translate-y-1 md:hover:border-accent/20 md:hover:shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]",
                                "flex flex-col justify-between"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                                    <Folder className="h-5 w-5 text-accent" />
                                </div>
                                <h3 className="truncate text-lg font-semibold text-primary">
                                    {workspace.name}
                                </h3>
                            </div>
                            <p className="mt-6 text-sm text-muted">
                                Click to open workspace
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
