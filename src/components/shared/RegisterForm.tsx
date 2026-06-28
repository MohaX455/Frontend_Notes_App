"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth.schemas";
import { Button, Input, Alert } from "@/components/ui";
import { AuthService } from "@/lib/auth/auth.service";
import { normalizeApiError } from "@/lib/errors/api-error";

export const RegisterForm = () => {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setApiError(null);
        setSuccessMessage(null);
        clearErrors();

        try {
            await AuthService.register({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            setSuccessMessage(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            const normalizedError = normalizeApiError(error);
            const fieldErrors = normalizedError.fieldErrors;

            if (fieldErrors?.username) {
                setError("username", { type: "server", message: fieldErrors.username });
            }

            if (fieldErrors?.email) {
                setError("email", { type: "server", message: fieldErrors.email });
            }

            if (fieldErrors?.password) {
                setError("password", { type: "server", message: fieldErrors.password });
            }

            if (fieldErrors?.confirmPassword) {
                setError("confirmPassword", {
                    type: "server",
                    message: fieldErrors.confirmPassword,
                });
            }

            setApiError(normalizedError.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            {apiError && <Alert type="error">{apiError}</Alert>}
            {successMessage && <Alert type="success">{successMessage}</Alert>}

            <Input
                label="Username"
                type="text"
                placeholder="john_doe"
                {...register("username")}
                error={errors.username?.message}
                hint="3-30 characters, letters, numbers, underscores only"
                disabled={isSubmitting}
            />

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
                disabled={isSubmitting}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
                hint="Min 8 chars: uppercase, lowercase, number"
                disabled={isSubmitting}
            />

            <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                disabled={isSubmitting}
            />

            <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full"
            >
                Create account
            </Button>
        </form>
    );
};
