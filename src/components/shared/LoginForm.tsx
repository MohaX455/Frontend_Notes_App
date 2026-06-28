"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schemas";
import { Button, Input, Alert } from "@/components/ui";
import { AuthService } from "@/lib/auth/auth.service";
import { normalizeApiError } from "@/lib/errors/api-error";

export const LoginForm = () => {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setApiError(null);
        clearErrors();
        try {
            const response = await AuthService.login(data);
            const { token, user } = response;
            AuthService.setAuthData(user, token.access_token);
            router.push("/workspaces");
        } catch (error) {
            const normalizedError = normalizeApiError(error);
            const fieldErrors = normalizedError.fieldErrors;

            if (fieldErrors?.email) {
                setError("email", { type: "server", message: fieldErrors.email });
            }

            if (fieldErrors?.password) {
                setError("password", { type: "server", message: fieldErrors.password });
            }

            if (!fieldErrors?.email && !fieldErrors?.password) {
                setApiError(normalizedError.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            {apiError && <Alert type="error">{apiError}</Alert>}

            <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
            />

            <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full"
            >
                Sign in
            </Button>
        </form>
    );
};
