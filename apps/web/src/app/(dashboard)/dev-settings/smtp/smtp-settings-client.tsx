"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bytesend/ui/src/card";
import { TextWithCopyButton } from "@bytesend/ui/src/text-with-copy";
import { Input } from "@bytesend/ui/src/input";
import { Button } from "@bytesend/ui/src/button";
import { toast } from "@bytesend/ui/src/toaster";
import { api } from "~/trpc/react";
import { RotateCcw } from "lucide-react";

interface Props {
  smtpHost: string;
  smtpPort: string;
  smtpDefaultUsername: string;
  currentSmtpUsername: string | null;
}

const STATIC_FIELDS = [
  { label: "Host", key: "host" },
  { label: "Port", key: "port", hint: "For encrypted/TLS connections use 2465, 587, or 2587" },
  { label: "Password", key: "password", hint: "Use any of your API keys as the password" },
] as const;

export function SmtpSettingsClient({
  smtpHost,
  smtpPort,
  smtpDefaultUsername,
  currentSmtpUsername,
}: Props) {
  const [username, setUsername] = useState(currentSmtpUsername ?? "");
  const [isDirty, setIsDirty] = useState(false);

  const updateMutation = api.team.updateSmtpUsername.useMutation({
    onSuccess: () => {
      toast.success("SMTP username updated");
      setIsDirty(false);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const effectiveUsername = currentSmtpUsername ?? smtpDefaultUsername;

  const staticValues: Record<string, string> = {
    host: smtpHost,
    port: smtpPort,
    password: "YOUR_API_KEY",
  };

  const handleSave = () => {
    const trimmed = username.trim();
    updateMutation.mutate({
      smtpUsername: trimmed === "" || trimmed === smtpDefaultUsername ? null : trimmed,
    });
  };

  const handleReset = () => {
    setUsername("");
    updateMutation.mutate({ smtpUsername: null });
  };

  return (
    <Card className="max-w-2xl border-border/60">
      <CardHeader>
        <CardTitle className="text-base">SMTP credentials</CardTitle>
        <CardDescription>
          Send emails using SMTP instead of the REST API.{" "}
          <a
            href="https://docs.bytesend.cloud/get-started/smtp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Learn more
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Static fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          {STATIC_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {field.label}
              </label>
              <TextWithCopyButton
                className="mt-1.5 rounded-lg p-2.5 w-full bg-muted/50 border border-border/50 font-mono text-sm"
                value={staticValues[field.key]!}
              />
              {"hint" in field && field.hint && (
                <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>
              )}
            </div>
          ))}
        </div>

        {/* Editable username */}
        <div className="border-t border-border/60 pt-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            {currentSmtpUsername && (
              <button
                type="button"
                onClick={handleReset}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to default
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsDirty(true);
              }}
              placeholder={smtpDefaultUsername}
              className="font-mono text-sm"
              maxLength={64}
            />
            {isDirty && (
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                size="sm"
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Your current username is{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded border border-border/60 text-[11px]">
              {effectiveUsername}
            </code>
            {!currentSmtpUsername && (
              <span className="ml-1 text-muted-foreground/60">(default)</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
