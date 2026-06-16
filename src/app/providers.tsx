"use client";

import { ReactNode, useMemo } from "react";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationToast } from "@/components/ui";
import { presentError } from "@/lib/errors/error-presenter";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

function AuthProvider({ children }: { children: ReactNode }) {
    // Initialize automatic token refresh for authenticated users
    useTokenRefresh();

    return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
    // Create QueryClient inside component to avoid serialization issues
    const queryClient = useMemo(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                        presentError(error, { title: "Unable to load data" });
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error) => {
                        presentError(error, { title: "Action failed" });
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        retry: 1,
                    },
                },
            }),
        []
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <NotificationToast />
            </AuthProvider>
        </QueryClientProvider>
    );
}
