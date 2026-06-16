"use client";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
    Workspace,
    WorkspaceListResponse,
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest
} from "@/types";

export class WorkspaceService {
    static async getWorkspaces(): Promise<Workspace[]> {
        const response = await apiClient.get<WorkspaceListResponse>(API_ENDPOINTS.workspaces.list);
        return response.data.workspaces;
    }

    static async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
        const response = await apiClient.post<Workspace>(API_ENDPOINTS.workspaces.create, data);
        return response.data;
    }

    static async getWorkspace(id: number): Promise<Workspace> {
        const response = await apiClient.get<Workspace>(API_ENDPOINTS.workspaces.getById(id));
        return response.data;
    }

    static async updateWorkspace(id: number, data: UpdateWorkspaceRequest): Promise<Workspace> {
        const response = await apiClient.put<Workspace>(API_ENDPOINTS.workspaces.update(id), data);
        return response.data;
    }

    static async deleteWorkspace(id: number): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.workspaces.delete(id));
    }
}