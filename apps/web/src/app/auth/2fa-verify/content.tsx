"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@bytesend/ui/src/button";
import { Input } from "@bytesend/ui/src/input";
import { toast } from "@bytesend/ui/src/toaster";

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
            toast.error("Verification failed");
            setCode("");
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm">
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-8">
                    <h1 className="text-xl font-semibold mb-1">Two-Factor Authentication</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Enter the code from your authenticator app to continue.
                    </p>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <Input
                            placeholder={useRecoveryCode ? "AABBCCDDEE" : "123456"}
                            value={code}
                            onChange={(e) => setCode(e.target.value.trim())}
                            maxLength={useRecoveryCode ? 10 : 6}
                            className="font-mono text-center text-lg tracking-widest"
                            autoComplete="off"
                            disabled={isVerifying}
                        />

                        <Button
                            type="submit"
                            isLoading={isVerifying}
                            disabled={
                                isVerifying ||
                                (useRecoveryCode ? code.length !== 10 : code.length !== 6)
                            }
                            className="w-full"
                        >
                            Verify
                        </Button>
                    </form>

                    <button
                        type="button"
                        onClick={() => {
                            setUseRecoveryCode(!useRecoveryCode);
                            setCode("");
                        }}
                        disabled={isVerifying}
                        className="mt-4 w-full text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                        {useRecoveryCode ? "Use authenticator code instead" : "Use a recovery code"}
                    </button>
                </div>
            </div>
        </div>
    );
}
