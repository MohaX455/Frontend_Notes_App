"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { LoginForm } from "@/components/shared";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-surface flex items-center justify-center p-4">
            {/* Close Button */}
            <Link
                href="/"
                className="absolute top-6 right-6 p-2 cursor-default"
            >
                <X className="w-6 h-6 cursor-pointer text-muted group-hover:text-primary transition-colors" />
            </Link>

            {/* Login Card */}
            <div className="bg-primary-foreground rounded-lg shadow-xl border border-muted/10 p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-primary mb-2">
                        Welcome back
                    </h1>
                    <p className="text-muted">
                        Sign in to your account to continue
                    </p>
                </div>

                <LoginForm />

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-accent hover:text-accent/80 font-medium transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
