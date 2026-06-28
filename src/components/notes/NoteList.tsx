"use client";

import { useMemo, useState } from "react";
import { Plus, Pin } from "lucide-react";
import { Button } from "@/components/ui";
import { Note } from "@/types";
import { cn } from "@/lib/utils";

interface NoteListProps {
    notes: Note[];
    selectedNoteId: number | null;
    isLoading: boolean;
    onSelectNote: (noteId: number) => void;
    onCreateNote: () => void;
}

const getNotePreview = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
        return "Empty note";
    }

    const line = trimmed.split("\n")[0] ?? "";
    return line.length > 80 ? `${line.slice(0, 80).trim()}…` : line;
};

export const NoteList = ({ notes, selectedNoteId, isLoading, onSelectNote, onCreateNote }: NoteListProps) => {
    const [search, setSearch] = useState("");

    const filteredNotes = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return notes;
        }

        return notes.filter((note) => {
            return (
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
            );
        });
    }, [notes, search]);

    const noteCountLabel = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;

    return (
        <section className="flex h-full flex-col rounded-lg border border-muted/10 bg-surface p-4 sm:p-5 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-2xl font-semibold text-primary leading-tight truncate mb-1">
                        Notes
                    </h2>
                    <p className="text-sm text-muted">{noteCountLabel}</p>
                </div>
                <Button variant="outline" onClick={onCreateNote} className="shrink-0 rounded-lg px-4 py-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New note
                </Button>
            </div>

            <div className="mb-5">
                <input
                    id="note-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search notes"
                    className="w-full rounded-lg border border-muted/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-muted transition focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none"
                />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-1 min-h-[320px] custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="h-24 rounded-lg bg-muted/15 animate-pulse" />
                        ))}
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-muted/20 bg-muted/5 p-8 text-center">
                        <p className="text-sm font-medium text-primary mb-3">No notes found</p>
                        <p className="text-sm text-muted mb-5 max-w-xs">
                            Use the search above or create a new note to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotes.map((note) => {
                            const isActive = note.id === selectedNoteId;

                            return (
                                <button
                                    key={note.id}
                                    type="button"
                                    onClick={() => onSelectNote(note.id)}
                                    className={cn(
                                        "w-full text-left rounded-lg border border-muted/10 bg-white p-4 transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/10",
                                        isActive
                                            ? "border-accent/20 bg-accent/5 shadow-sm"
                                            : "md:hover:border-muted/20 md:hover:bg-surface"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <h3 className="text-base font-semibold text-primary truncate">
                                            {note.title || "Untitled note"}
                                        </h3>
                                        {note.is_pinned && (
                                            <div className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                                                <Pin className="w-3.5 h-3.5" />
                                                Pinned
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted line-clamp-2">
                                        {getNotePreview(note.content)}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
