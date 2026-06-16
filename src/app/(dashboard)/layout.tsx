import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/shared";
import { Sidebar } from "@/components/dashboard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-surface">
                <Sidebar />

                {/* Main content - Scrollable, with left margin to account for sidebar */}
                <main className="lg:ml-64 min-h-screen overflow-y-auto">
                    <div className="min-h-screen">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
