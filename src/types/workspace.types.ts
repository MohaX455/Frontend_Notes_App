export interface Workspace {
    id: number;
    name: string;
}

export interface WorkspaceListResponse {
    workspaces: Workspace[];
}

export interface CreateWorkspaceRequest {
    name: string;
}

export interface UpdateWorkspaceRequest {
    name: string;
}
