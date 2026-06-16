"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Folder } from "lucide-react";
import { useWorkspaces, useCreateWorkspace } from "@/hooks/useWorkspaces";
import { Button, Alert } from "@/components/ui";
import { cn } from "@/lib/utils";
import { normalizeApiError } from "@/lib/errors/api-error";

export default function WorkspacesPage() {
    const router = useRouter();
    const { data: workspaces = [], isLoading } = useWorkspaces();
    const createWorkspace = useCreateWorkspace();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        try {
            const workspace = await createWorkspace.mutateAsync({ name: newWorkspaceName.trim() });
            setNewWorkspaceName("");
            setShowCreateForm(false);
            setFormError(null);
            router.push(`/workspaces/${workspace.id}`);
        } catch (error) {
            const normalizedError = normalizeApiError(error);
            setFormError(normalizedError.message);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted/20 rounded w-48" />
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
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary mb-2">
                        Workspaces
                    </h1>
                    <p className="text-muted">
                        Organize your notes and ideas in dedicated workspaces
                    </p>
                </div>

                <Button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Workspace
                </Button>
            </div>

            {/* Create Workspace Form */}
            {showCreateForm && (
                <div className="mb-8 p-6 bg-surface rounded-lg border border-muted/10">
                    <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>
                    {formError && (
                        <div className="mb-4">
                            <Alert type="error">{formError}</Alert>
                        </div>
                    )}
                    <form onSubmit={handleCreateWorkspace} className="flex gap-4">
                        <input
                            type="text"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="Workspace name"
                            className="flex-1 px-3 py-2 border border-muted/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                            autoFocus
                        />
                        <Button
                            type="submit"
                            disabled={!newWorkspaceName.trim() || createWorkspace.isPending}
                        >
                            {createWorkspace.isPending ? "Creating..." : "Create"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowCreateForm(false);
                                setNewWorkspaceName("");
                                setFormError(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </form>
                </div>
            )}

            {/* Workspaces Grid */}
            {workspaces.length === 0 ? (
                <div className="text-center py-16">
                    <Folder className="w-16 h-16 text-muted/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary mb-2">
                        No workspaces yet
                    </h3>
                    <p className="text-muted mb-6 max-w-md mx-auto">
                        Create your first workspace to start organizing your notes and ideas.
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Workspace
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => router.push(`/workspaces/${workspace.id}`)}
                            className={cn(
                                "p-6 bg-surface rounded-lg border border-muted/10 cursor-pointer",
                                "hover:border-accent/20 hover:shadow-sm transition-all duration-200",
                                "group"
                            )}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                                    <Folder className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="font-semibold text-primary truncate">
                                    {workspace.name}
                                </h3>
                            </div>
                            <p className="text-sm text-muted">
                                Click to open workspace
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
