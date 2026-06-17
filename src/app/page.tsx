"use client";

import Link from "next/link";
import { Logo, Button } from "@/components/ui";

export default function LandingPage() {

    return (
        <main className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop')"
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/85" />

            {/* Header */}
            <header className="relative border-b border-white/10 bg-surface/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center justify-between gap-4">
                    <Link href="/" className="inline-flex items-center">
                        <Logo variant="homepage" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="outline" size="md" className="min-w-[120px] bg-white/10 border-white/20 text-white hover:bg-white/20">
                                Sign in
                            </Button>
                        </Link>
                        <Link href="/register" className="hidden sm:inline-flex">
                            <Button variant="primary" size="md" className="min-w-[140px] bg-white text-primary hover:bg-white/90">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="relative flex-1 flex items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                        Organize your thoughts
                    </h1>

                    <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/90 mb-10 leading-8">
                        A modern note-taking application designed for clarity and focus.
                        Create workspaces, collaborate seamlessly, and keep your ideas organized.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <Button variant="primary" size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
