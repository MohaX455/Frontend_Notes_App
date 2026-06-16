"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCreateWorkspace } from "@/hooks/useWorkspaces";
import { Button, Input, Alert } from "@/components/ui";
import { normalizeApiError } from "@/lib/errors/api-error";

export default function NewWorkspacePage() {
    const router = useRouter();
    const createWorkspace = useCreateWorkspace();
    const [name, setName] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const workspace = await createWorkspace.mutateAsync({ name: name.trim() });
            setFormError(null);
            router.push(`/workspaces/${workspace.id}`);
        } catch (error) {
            const normalizedError = normalizeApiError(error);
            setFormError(normalizedError.message);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <h1 className="text-3xl font-display font-bold text-primary mb-2">
                    Create New Workspace
                </h1>
                <p className="text-muted">
                    Create a new workspace to organize your notes and ideas
                </p>
            </div>

            {/* Form */}
            <div className="bg-surface rounded-lg border border-muted/10 p-8">
                {formError && (
                    <div className="mb-4">
                        <Alert type="error">{formError}</Alert>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                            Workspace Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter workspace name"
                            className="w-full"
                            autoFocus
                        />
                        <p className="text-xs text-muted mt-1">
                            Choose a descriptive name for your workspace
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={!name.trim() || createWorkspace.isPending}
                            className="flex-1"
                        >
                            {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}