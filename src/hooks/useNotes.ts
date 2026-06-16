"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteService } from "@/lib/notes/note.service";
import { useNotificationStore } from "@/stores/notification.store";
import {
    CreateNoteRequest,
    UpdateNoteRequest,
} from "@/types";

export const useNotes = (workspaceId: number) => {
    return useQuery({
        queryKey: ["notes", workspaceId],
        queryFn: () => NoteService.getNotes(workspaceId),
        enabled: workspaceId > 0,
        staleTime: 1000 * 60,
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotificationStore((state) => state.pushNotification);

    return useMutation({
        mutationFn: (data: CreateNoteRequest) => NoteService.createNote(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["notes", data.workspace_id] });
            pushNotification({
                type: "success",
                title: "Note created",
                message: "Your new note has been created successfully.",
            });
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteId, workspaceId, data }: { noteId: number; workspaceId: number; data: UpdateNoteRequest }) =>
            NoteService.updateNote(noteId, workspaceId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["note", variables.workspaceId, variables.noteId] });
            queryClient.invalidateQueries({ queryKey: ["notes", variables.workspaceId] });
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotificationStore((state) => state.pushNotification);

    return useMutation({
        mutationFn: ({ noteId, workspaceId }: { noteId: number; workspaceId: number }) =>
            NoteService.deleteNote(noteId, workspaceId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["notes", variables.workspaceId] });
            queryClient.invalidateQueries({ queryKey: ["note", variables.workspaceId, variables.noteId] });
            pushNotification({
                type: "success",
                title: "Note deleted",
                message: "The note has been deleted successfully.",
            });
        },
    });
};
