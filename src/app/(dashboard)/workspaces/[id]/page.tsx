"use client";

import { useEffect, useMemo, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspaces";
import { useNotes, useCreateNote, useDeleteNote } from "@/hooks/useNotes";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteList } from "@/components/notes/NoteList";
import { Alert } from "@/components/ui";
import { normalizeApiError } from "@/lib/errors/api-error";

interface WorkspaceDetailPageProps {
    params: {
        id: string;
    };
}

export default function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
    const workspaceId = parseInt(params.id, 10);
    const { data: workspace, isLoading: isWorkspaceLoading, error } = useWorkspace(workspaceId);
    const { data: notes = [], isLoading: isNotesLoading } = useNotes(workspaceId);
    const createNote = useCreateNote();
    const deleteNote = useDeleteNote();
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [mutationError, setMutationError] = useState<string | null>(null);

    const selectedNote = useMemo(() => {
        if (!selectedNoteId) {
            return null;
        }
        return notes.find((note) => note.id === selectedNoteId) ?? null;
    }, [notes, selectedNoteId]);

    useEffect(() => {
        if (!workspaceId) {
            return;
        }

        if (!selectedNoteId && notes.length > 0) {
            const firstNote = notes[0];
            if (firstNote) {
                setSelectedNoteId(firstNote.id);
            }
            return;
        }

        if (selectedNoteId && !notes.some((note) => note.id === selectedNoteId)) {
            setSelectedNoteId(notes[0]?.id ?? null);
        }
    }, [notes, selectedNoteId, workspaceId]);

    const handleCreateNote = async () => {
        try {
            const note = await createNote.mutateAsync({
                workspace_id: workspaceId,
                title: "New note",
                content: "Start writing...",
            });

            setSelectedNoteId(note.id);
            setMutationError(null);
        } catch (error) {
            const normalizedError = normalizeApiError(error);
            setMutationError(normalizedError.message);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        try {
            await deleteNote.mutateAsync({ noteId, workspaceId });
            const nextNote = notes.find((note) => note.id !== noteId);
            setSelectedNoteId(nextNote?.id ?? null);
            setMutationError(null);
        } catch (error) {
            const normalizedError = normalizeApiError(error);
            setMutationError(normalizedError.message);
        }
    };

    if (isWorkspaceLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 w-72 rounded bg-muted/20" />
                    <div className="h-5 w-96 rounded bg-muted/20" />
                </div>
            </div>
        );
    }

    if (error || !workspace) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">Workspace not found</h2>
                    <p className="text-muted">
                        The workspace you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-primary mb-2">
                    {workspace.name}
                </h1>
                <p className="text-muted">
                    A clean space to create, edit and manage your notes inside this workspace.
                </p>
            </div>
            {mutationError && (
                <div className="mb-6">
                    <Alert type="error">{mutationError}</Alert>
                </div>
            )}

            <div className="grid min-h-[calc(100vh-192px)] gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
                <NoteList
                    workspaceName={workspace.name}
                    notes={notes}
                    selectedNoteId={selectedNoteId}
                    isLoading={isNotesLoading}
                    onSelectNote={setSelectedNoteId}
                    onCreateNote={handleCreateNote}
                />
                <NoteEditor
                    workspaceId={workspaceId}
                    note={selectedNote}
                    isLoading={isNotesLoading && !selectedNote}
                    onCreateNote={handleCreateNote}
                    onDeleteNote={handleDeleteNote}
                />
            </div>
        </div>
    );
}
