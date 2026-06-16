"use client";

import Link from "next/link";
import { Logo, Button } from "@/components/ui";

export default function LandingPage() {

    return (
        <main className="min-h-screen bg-surface flex flex-col relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop')"
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/85" />

            {/* Header */}
            <header className="relative border-b border-white/10 bg-surface/10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                    <Logo variant="homepage" />
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="outline" size="md" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                Sign in
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" size="md" className="bg-white text-primary hover:bg-white/90">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="relative flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-2xl">
                    <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-6 leading-tight">
                        Organize your thoughts
                    </h1>

                    <p className="text-lg text-white/90 mb-12 leading-relaxed">
                        A modern note-taking application designed for clarity and focus.
                        Create workspaces, collaborate seamlessly, and keep your ideas organized.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <Button variant="primary" size="lg" className="bg-white text-primary hover:bg-white/90">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
