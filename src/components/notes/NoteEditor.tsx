"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Note } from "@/types";
import { useUpdateNote } from "@/hooks/useNotes";
import { normalizeApiError } from "@/lib/errors/api-error";

interface NoteEditorProps {
    workspaceId: number;
    note: Note | null;
    isLoading: boolean;
    onCreateNote: () => void;
    onDeleteNote: (noteId: number) => Promise<void>;
}

export const NoteEditor = ({ workspaceId, note, isLoading, onCreateNote, onDeleteNote }: NoteEditorProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saveLabel, setSaveLabel] = useState("Saved");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const updateNote = useUpdateNote();

    const activeNote = note;

    useEffect(() => {
        if (!activeNote) {
            setTitle("");
            setContent("");
            setSaveLabel("Saved");
            return;
        }

        setTitle(activeNote.title);
        setContent(activeNote.content);
        setSaveLabel("Saved");
    }, [activeNote]);

    useEffect(() => {
        if (!activeNote) {
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content;
        const noteTitle = activeNote.title.trim();
        const noteContent = activeNote.content;
        const changed = trimmedTitle !== noteTitle || trimmedContent !== noteContent;

        if (!changed) {
            setSaveLabel("Saved");
            return;
        }

        setSaveLabel("Saving...");
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(async () => {
            try {
                await updateNote.mutateAsync({
                    noteId: activeNote.id,
                    workspaceId,
                    data: {
                        title: trimmedTitle || "Untitled note",
                        content: trimmedContent || "",
                        is_pinned: activeNote.is_pinned,
                    },
                });
                setSaveLabel("Saved");
            } catch (error) {
                const normalizedError = normalizeApiError(error);
                setSaveLabel(`Save failed: ${normalizedError.message}`);
            }
        }, 700);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [title, content, activeNote, updateNote, workspaceId]);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-muted/10 bg-surface p-6 h-full">
                <div className="space-y-4">
                    <div className="h-12 w-3/4 rounded-lg bg-muted/20 animate-pulse" />
                    <div className="h-10 rounded-lg bg-muted/20 animate-pulse" />
                    <div className="h-[420px] rounded-lg bg-muted/20 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!activeNote) {
        return (
            <div className="rounded-lg border border-muted/10 bg-surface p-8 h-full flex flex-col items-center justify-center text-center gap-4">
                <Sparkles className="w-10 h-10 text-accent" />
                <div>
                    <h2 className="text-2xl font-semibold text-primary mb-2">Your writing space is ready</h2>
                    <p className="text-sm text-muted max-w-md">
                        Create a new note and keep your ideas flowing in a calm, focused editor.
                    </p>
                </div>
                <Button variant="outline" onClick={onCreateNote} className="rounded-lg px-5 py-2">
                    New note
                </Button>
            </div>
        );
    }

    return (
        <>
            <section className="flex h-full flex-col rounded-lg border border-muted/10 bg-surface p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted uppercase tracking-[0.2em]">
                            <span>Note editor</span>
                        </div>
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Untitled note"
                            className="w-full bg-transparent border-b border-muted/20 pb-3 text-3xl font-semibold text-primary focus:border-accent focus:outline-none"
                        />
                        <p className="mt-3 text-sm text-muted">{saveLabel}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmOpen(true)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                        <Button onClick={onCreateNote} className="px-5 py-2">
                            New note
                        </Button>
                    </div>
                </div>

                <div className="flex-1 min-h-[280px] sm:min-h-[420px] overflow-hidden rounded-lg border border-muted/10 bg-white/80 p-4 shadow-sm focus-within:ring-2 focus-within:ring-accent/10">
                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Start writing your note..."
                        className="h-full w-full resize-none border-0 bg-transparent p-0 text-base leading-7 text-primary placeholder:text-muted focus:outline-none"
                    />
                </div>
            </section>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={async () => {
                    try {
                        await onDeleteNote(activeNote.id);
                        setIsConfirmOpen(false);
                    } catch { }
                }}
                title="Delete Note"
                description={`Are you sure you want to delete "${activeNote.title || 'Untitled note'}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
        </>
    );
};
