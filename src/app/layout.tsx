import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "Notes - Organize Your Thoughts",
    description: "A modern, clean note-taking application. Create workspaces, organize your ideas, and collaborate seamlessly.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
