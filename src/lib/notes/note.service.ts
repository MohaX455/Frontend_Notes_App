"use client";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { CreateNoteRequest, Note, NoteListResponse, UpdateNoteRequest } from "@/types";

export class NoteService {
    static async getNotes(workspaceId: number): Promise<Note[]> {
        const response = await apiClient.get<NoteListResponse>(API_ENDPOINTS.notes.list, {
            params: { workspace_id: workspaceId },
        });

        return response.data.notes;
    }

    static async getNote(noteId: number, workspaceId: number): Promise<Note> {
        const response = await apiClient.get<Note>(API_ENDPOINTS.notes.getById(noteId), {
            params: { workspace_id: workspaceId },
        });

        return response.data;
    }

    static async createNote(data: CreateNoteRequest): Promise<Note> {
        const response = await apiClient.post<Note>(API_ENDPOINTS.notes.create, data);
        return response.data;
    }

    static async updateNote(noteId: number, workspaceId: number, data: UpdateNoteRequest): Promise<Note> {
        const response = await apiClient.put<Note>(API_ENDPOINTS.notes.update(noteId), data, {
            params: { workspace_id: workspaceId },
        });
        return response.data;
    }

    static async deleteNote(noteId: number, workspaceId: number): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.notes.delete(noteId), {
            params: { workspace_id: workspaceId },
        });
    }
}
