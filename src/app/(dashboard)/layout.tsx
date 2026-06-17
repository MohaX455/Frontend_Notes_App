"use client";

import { ReactNode, useState } from "react";
import { ProtectedRoute } from "@/components/shared";
import { Sidebar } from "@/components/dashboard";
import { DashboardHeader } from "@/components/shared";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-surface">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main content - Scrollable, with left margin to account for sidebar */}
                <main className="lg:ml-72 min-h-screen overflow-y-auto">
                        <DashboardHeader onOpenMenu={() => setIsSidebarOpen(true)} />
                        <div className="min-h-screen">
                            {children}
                        </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
