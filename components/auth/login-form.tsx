"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading, setLoading, isAuthenticated } = useAuthStore();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid credentials");
                setLoading(false);
                return;
            }

            login(data.token, data.user);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login");
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                >
                    Email
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    placeholder="Your email"
                    type="email"
                    name="email"
                    disabled={isLoading}
                    required
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="password"
                    placeholder="Your password"
                    type="password"
                    name="password"
                    disabled={isLoading}
                    required
                />
            </div>
            {error && (
                <div className="text-sm text-red-500">
                    {error}
                </div>
            )}
            <button
                className="inline-flex w-full items-center justify-center rounded-md bg-[#0039CB] px-4 py-2 text-sm font-medium text-white hover:bg-[#0039CB]/90 focus:outline-none focus:ring-2 focus:ring-[#0039CB] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}