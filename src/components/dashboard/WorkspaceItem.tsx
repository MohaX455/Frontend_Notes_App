"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useUpdateWorkspace, useDeleteWorkspace } from "@/hooks/useWorkspaces";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { Workspace } from "@/types";

interface WorkspaceItemProps {
    workspace: Workspace;
    isActive: boolean;
    onNavigate?: () => void;
}

export const WorkspaceItem = ({ workspace, isActive, onNavigate }: WorkspaceItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(workspace.name);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const updateWorkspace = useUpdateWorkspace();
    const deleteWorkspace = useDeleteWorkspace();

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        const trimmedValue = editValue.trim();
        if (trimmedValue && trimmedValue !== workspace.name) {
            try {
                await updateWorkspace.mutateAsync({
                    id: workspace.id,
                    data: { name: trimmedValue },
                });
            } catch {
                setEditValue(workspace.name);
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(workspace.name);
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSave();
        else if (e.key === "Escape") handleCancel();
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (editValue.trim() !== workspace.name) handleSave();
            else handleCancel();
        }, 100);
    };

    if (isEditing) {
        return (
            <div className="px-3 py-2">
                <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="w-full bg-surface border border-accent/30 rounded-lg px-2 py-1 text-sm text-primary focus:outline-none focus:border-accent"
                    maxLength={50}
                />
            </div>
        );
    }

    return (
        <>
            <div className="group relative">
                <Link
                    href={`/workspaces/${workspace.id}`}
                    className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors truncate pr-10 md:pr-8",
                        isActive
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "text-muted hover:text-primary border border-surface"
                    )}
                    onClick={() => onNavigate?.()}
                >
                    <span className="truncate">{workspace.name}</span>
                </Link>

                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <DropdownMenu
                        onOpenChange={setIsMenuOpen}
                        trigger={
                            <button
                                className={cn(
                                    "p-1 rounded-lg transition-colors hover:bg-muted/10",
                                    "opacity-100 pointer-events-auto",
                                    "md:opacity-0 md:pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto",
                                    isMenuOpen && "opacity-100 pointer-events-auto bg-muted/10"
                                )}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        }
                    >
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                            <Edit className="w-4 h-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setIsConfirmOpen(true)}
                            className="text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={async () => {
                    try {
                        await deleteWorkspace.mutateAsync(workspace.id);
                        setIsConfirmOpen(false);
                        router.push("/workspaces");
                    } catch { }
                }}
                title="Delete Workspace"
                description={`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={deleteWorkspace.isPending}
                variant="danger"
            />
        </>
    );
};