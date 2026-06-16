"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkspaceService } from "@/lib/workspaces/workspace.service";
import { useNotificationStore } from "@/stores/notification.store";
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from "@/types";

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: WorkspaceService.getWorkspaces,
    });
};

export const useWorkspace = (id: number) => {
    return useQuery({
        queryKey: ["workspace", id],
        queryFn: () => WorkspaceService.getWorkspace(id),
        enabled: !!id,
    });
};

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotificationStore((state) => state.pushNotification);

    return useMutation({
        mutationFn: (data: CreateWorkspaceRequest) => WorkspaceService.createWorkspace(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            pushNotification({
                type: "success",
                title: "Workspace created",
                message: `"${data.name}" has been created successfully.`,
            });
        },
    });
};

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotificationStore((state) => state.pushNotification);

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateWorkspaceRequest }) =>
            WorkspaceService.updateWorkspace(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            pushNotification({
                type: "success",
                title: "Workspace updated",
                message: `"${variables.data.name}" has been updated successfully.`,
            });
        },
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();
    const pushNotification = useNotificationStore((state) => state.pushNotification);

    return useMutation({
        mutationFn: (id: number) => WorkspaceService.deleteWorkspace(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            pushNotification({
                type: "success",
                title: "Workspace deleted",
                message: "The workspace has been deleted successfully.",
            });
        },
    });
};