export const API_ENDPOINTS = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        refresh: "/auth/refresh",
        logout: "/auth/logout",
        me: "/auth/me",
    },
    workspaces: {
        list: "/api/workspaces",
        create: "/api/workspace",
        getById: (id: number) => `/api/workspace/${id}`,
        update: (id: number) => `/api/workspace/${id}`,
        delete: (id: number) => `/api/workspace/${id}`,
    },
    notes: {
        list: "/api/notes",
        create: "/api/notes",
        getById: (id: number) => `/api/notes/${id}`,
        update: (id: number) => `/api/notes/${id}`,
        delete: (id: number) => `/api/notes/${id}`,
    },
} as const;
