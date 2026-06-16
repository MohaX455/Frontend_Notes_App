export interface Note {
    id: number;
    workspace_id: number;
    title: string;
    content: string;
    is_pinned: boolean;
}

export interface NoteListResponse {
    notes: Note[];
}

export interface CreateNoteRequest {
    workspace_id: number;
    title: string;
    content: string;
}

export interface UpdateNoteRequest {
    title: string;
    content: string;
    is_pinned: boolean;
}
