"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@bytesend/ui/src/button";
import { Input } from "@bytesend/ui/src/input";
import { toast } from "@bytesend/ui/src/toaster";
import { FaShieldHalved } from "react-icons/fa6";

export function TwoFactorVerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [code, setCode] = useState("");
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Please enter a code");
            return;
        }

        setIsVerifying(true);
        try {
            const body = useRecoveryCode
                ? { recoveryCode: code }
                : { code: code };

            const res = await fetch("/api/auth/2fa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.error ?? "Verification failed");
                setCode("");
                return;
            }

            toast.success("Two-factor authentication verified");
            const redirect = searchParams.get("redirect") || "/dashboard";
            router.push(redirect);
        } catch (err) {
            toast.error("Verification failed. Please try again.");
            setCode("");
        } finally {
            setIsVerifying(false);
        }
    }

    const toggleCodeType = () => {
        setUseRecoveryCode(!useRecoveryCode);
        setCode("");
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 overflow-hidden">
            {/* Background gradient orbs */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-120 w-180 rounded-full bg-primary/8 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

            <div className="relative w-full max-w-sm">
                <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-8 space-y-6">
                    {/* Icon and heading */}
                    <div className="text-center space-y-3">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                            <FaShieldHalved className="size-7 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold text-foreground">Two-Factor Authentication</h1>
                            <p className="text-sm text-muted-foreground">
                                {useRecoveryCode
                                    ? "Enter a recovery code to verify your account"
                                    : "Enter the code from your authenticator app to continue"}
                            </p>
                        </div>
                    </div>

                    {/* Verification form */}
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                {useRecoveryCode ? "Recovery Code" : "Authenticator Code"}
                            </label>
                            <Input
                                placeholder={useRecoveryCode ? "AABBCCDDEE" : "123456"}
                                value={code}
                                onChange={(e) => setCode(e.target.value.trim())}
                                maxLength={useRecoveryCode ? 10 : 6}
                                className="h-11 font-mono text-center text-lg tracking-widest rounded-xl bg-card/60 border-border/40"
                                autoComplete="off"
                                disabled={isVerifying}
                                autoFocus
                            />
                            <p className="text-xs text-muted-foreground/60">
                                {useRecoveryCode
                                    ? "Enter one of your 10-character backup codes"
                                    : "Enter the 6-digit code from your authenticator"}
                            </p>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isVerifying}
                            disabled={
                                isVerifying ||
                                (useRecoveryCode ? code.length !== 10 : code.length !== 6)
                            }
                            className="w-full h-11 rounded-xl shadow-lg shadow-primary/20"
                        >
                            Verify
                        </Button>
                    </form>

                    {/* Toggle recovery code option */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={toggleCodeType}
                            disabled={isVerifying}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2 disabled:opacity-50"
                        >
                            {useRecoveryCode
                                ? "Use authenticator code instead"
                                : "Lost your authenticator? Use a recovery code"}
                        </button>
                    </div>
                </div>

                {/* Help text */}
                <p className="text-center text-xs text-muted-foreground/50 mt-6">
                    This verification is valid for 12 hours on this device
                </p>
            </div>
        </main>
    );
}
