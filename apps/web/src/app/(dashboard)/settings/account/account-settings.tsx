"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@bytesend/ui/src/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@bytesend/ui/src/form";
import { Input } from "@bytesend/ui/src/input";
import { toast } from "@bytesend/ui/src/toaster";

import { api } from "~/trpc/react";

const accountEmailSchema = z.object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
});
type AccountEmailFormData = z.infer<typeof accountEmailSchema>;

const emailVerificationSchema = z.object({
    code: z.string().trim().toUpperCase().length(6, "Enter the 6-character code"),
});
type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

const twoFactorCodeSchema = z.object({
    code: z.string().trim().length(6, "Enter a valid 6-digit code"),
});
type TwoFactorCodeFormData = z.infer<typeof twoFactorCodeSchema>;

export default function AccountSettings() {
    const utils = api.useUtils();
    const router = useRouter();
    const profileQuery = api.user.getProfile.useQuery();

    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const [twoFactorSetup, setTwoFactorSetup] = useState<{
        secret: string;
        otpauthUrl: string;
    } | null>(null);
    const [showRecoveryCodes, setShowRecoveryCodes] = useState<string[] | null>(null);

    const requestEmailChangeMutation = api.user.requestEmailChange.useMutation();
    const confirmEmailChangeMutation = api.user.confirmEmailChange.useMutation();
    const startTwoFactorSetupMutation = api.user.startTwoFactorSetup.useMutation();
    const confirmTwoFactorSetupMutation = api.user.confirmTwoFactorSetup.useMutation();
    const disableTwoFactorMutation = api.user.disableTwoFactor.useMutation();
    const regenerateRecoveryCodesMutation = api.user.regenerateRecoveryCodes.useMutation();
    const recoveryCodeCountQuery = api.user.getRecoveryCodeCount.useQuery(undefined, {
        enabled: !!profileQuery.data?.twoFactorEnabled,
    });

    const emailForm = useForm<AccountEmailFormData>({
        resolver: zodResolver(accountEmailSchema),
        values: { email: profileQuery.data?.email ?? "" },
    });

    const emailVerifyForm = useForm<EmailVerificationFormData>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: { code: "" },
    });

    const twoFactorEnableForm = useForm<TwoFactorCodeFormData>({
        resolver: zodResolver(twoFactorCodeSchema),
        defaultValues: { code: "" },
    });

    const twoFactorDisableForm = useForm<TwoFactorCodeFormData>({
        resolver: zodResolver(twoFactorCodeSchema),
        defaultValues: { code: "" },
    });

    async function onSaveEmail(data: AccountEmailFormData) {
        requestEmailChangeMutation.mutate(
            { email: data.email },
            {
                onSuccess: (result) => {
                    setPendingEmail(result.email);
                    emailVerifyForm.reset({ code: "" });
                    toast.success("Verification code sent to your new email");
                },
                onError: (e) => toast.error(e.message),
            },
        );
    }

    async function onConfirmEmail(data: EmailVerificationFormData) {
        if (!pendingEmail) return;

        confirmEmailChangeMutation.mutate(
            { email: pendingEmail, code: data.code },
            {
                onSuccess: (updated) => {
                    setPendingEmail(null);
                    emailForm.reset({ email: updated.email ?? "" });
                    emailVerifyForm.reset({ code: "" });
                    utils.user.getProfile.invalidate();
                    router.refresh();
                    toast.success("Account email verified and updated");
                },
                onError: (e) => toast.error(e.message),
            },
        );
    }

    function onStartTwoFactor() {
        startTwoFactorSetupMutation.mutate(undefined, {
            onSuccess: (result) => {
                setTwoFactorSetup(result);
                twoFactorEnableForm.reset({ code: "" });
                toast.success("Scan the QR code and enter your authenticator code");
            },
            onError: (e) => toast.error(e.message),
        });
    }

    async function onConfirmTwoFactor(data: TwoFactorCodeFormData) {
        confirmTwoFactorSetupMutation.mutate(
            { code: data.code },
            {
                onSuccess: (result) => {
                    setTwoFactorSetup(null);
                    twoFactorEnableForm.reset({ code: "" });
                    setShowRecoveryCodes(result.recoveryCodes);
                    utils.user.getProfile.invalidate();
                    router.refresh();
                    toast.success("Two-factor authentication enabled — save your recovery codes!");
                },
                onError: (e) => toast.error(e.message),
            },
        );
    }

    async function onDisableTwoFactor(data: TwoFactorCodeFormData) {
        disableTwoFactorMutation.mutate(
            { code: data.code },
            {
                onSuccess: () => {
                    twoFactorDisableForm.reset({ code: "" });
                    utils.user.getProfile.invalidate();
                    router.refresh();
                    toast.success("Two-factor authentication disabled");
                },
                onError: (e) => toast.error(e.message),
            },
        );
    }

    return (
        <div className="flex flex-col gap-8 mt-6">
            {/* ── Account email ── */}
            <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold mb-1">Email Address</h3>
                <p className="text-xs text-muted-foreground mb-5">
                    This email is used for login and account notifications. Changes require email verification.
                </p>

                {profileQuery.data?.accounts?.some((a) => a.type === "oauth") ? (
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                        Your account is linked to{" "}
                        <span className="font-medium text-foreground">
                            {profileQuery.data.accounts.filter((a) => a.type === "oauth").map((a) => a.provider).join(", ")}
                        </span>
                        . Email changes are managed through your OAuth provider.
                    </div>
                ) : (
                    <>
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(onSaveEmail)} className="flex gap-3">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="you@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    isLoading={requestEmailChangeMutation.isPending}
                                    disabled={!emailForm.formState.isDirty}
                                >
                                    Send Code
                                </Button>
                            </form>
                        </Form>

                        {pendingEmail ? (
                            <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-4">
                                <p className="text-xs text-muted-foreground mb-3">
                                    Enter the code sent to <span className="font-semibold text-foreground">{pendingEmail}</span>.
                                </p>
                                <Form {...emailVerifyForm}>
                                    <form onSubmit={emailVerifyForm.handleSubmit(onConfirmEmail)} className="flex gap-3">
                                        <FormField
                                            control={emailVerifyForm.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="ABC123" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" isLoading={confirmEmailChangeMutation.isPending}>
                                            Verify
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        ) : null}
                    </>
                )}
            </div>

            {/* ── Two-factor auth ── */}
            <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold mb-1">Two-Factor Authentication</h3>
                <p className="text-xs text-muted-foreground mb-5">
                    Protect your account with an authenticator app using TOTP codes.
                </p>

                {profileQuery.data?.twoFactorEnabled ? (
                    <div className="space-y-3">
                        <p className="text-xs text-emerald-500">Two-factor authentication is currently enabled.</p>
                        <Form {...twoFactorDisableForm}>
                            <form onSubmit={twoFactorDisableForm.handleSubmit(onDisableTwoFactor)} className="flex gap-3">
                                <FormField
                                    control={twoFactorDisableForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Enter authenticator code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button variant="outline" type="submit" isLoading={disableTwoFactorMutation.isPending}>
                                    Disable
                                </Button>
                            </form>
                        </Form>
                    </div>
                ) : twoFactorSetup ? (
                    <div className="space-y-4">
                        <div className="w-fit rounded-lg border border-border/60 bg-white p-3">
                            <QRCodeSVG value={twoFactorSetup.otpauthUrl} size={140} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            If you cannot scan the QR code, enter this secret manually: <span className="font-mono text-foreground">{twoFactorSetup.secret}</span>
                        </p>

                        <Form {...twoFactorEnableForm}>
                            <form onSubmit={twoFactorEnableForm.handleSubmit(onConfirmTwoFactor)} className="flex gap-3">
                                <FormField
                                    control={twoFactorEnableForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Enter authenticator code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" isLoading={confirmTwoFactorSetupMutation.isPending}>
                                    Enable
                                </Button>
                            </form>
                        </Form>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTwoFactorSetup(null)}
                            disabled={confirmTwoFactorSetupMutation.isPending}
                        >
                            Cancel setup
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={onStartTwoFactor}
                        isLoading={startTwoFactorSetupMutation.isPending}
                    >
                        Set up 2FA
                    </Button>
                )}
            </div>

            {/* ── Recovery Codes ── */}
            {profileQuery.data?.twoFactorEnabled ? (
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-6">
                    <h3 className="text-sm font-semibold mb-1">Recovery Codes</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        Recovery codes let you access your account if you lose your authenticator.
                        {recoveryCodeCountQuery.data !== undefined && (
                            <span className="ml-1 font-medium text-foreground">
                                {recoveryCodeCountQuery.data.remaining} unused code{recoveryCodeCountQuery.data.remaining !== 1 ? "s" : ""} remaining.
                            </span>
                        )}
                    </p>

                    {showRecoveryCodes ? (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 font-mono text-xs grid grid-cols-2 gap-1.5">
                                {showRecoveryCodes.map((code) => (
                                    <span key={code} className="select-all">{code}</span>
                                ))}
                            </div>
                            <p className="text-xs text-amber-500">Save these codes now — they won&apos;t be shown again.</p>
                            <Button size="sm" variant="outline" onClick={() => setShowRecoveryCodes(null)}>
                                I&apos;ve saved my codes
                            </Button>
                        </div>
                    ) : (
                        <Form {...twoFactorDisableForm}>
                            <form
                                onSubmit={twoFactorDisableForm.handleSubmit(async (data) => {
                                    regenerateRecoveryCodesMutation.mutate(
                                        { code: data.code },
                                        {
                                            onSuccess: (result) => {
                                                setShowRecoveryCodes(result.recoveryCodes);
                                                twoFactorDisableForm.reset({ code: "" });
                                                void recoveryCodeCountQuery.refetch();
                                                toast.success("Recovery codes regenerated");
                                            },
                                            onError: (e) => toast.error(e.message),
                                        },
                                    );
                                })}
                                className="flex gap-3"
                            >
                                <FormField
                                    control={twoFactorDisableForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Authenticator code to regenerate" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button variant="outline" size="sm" type="submit" isLoading={regenerateRecoveryCodesMutation.isPending}>
                                    Regenerate
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
            ) : null}
        </div>
    );
}
