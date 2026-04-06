import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bytesend/ui/src/card";
import { TextWithCopyButton } from "@bytesend/ui/src/text-with-copy";
import { env } from "~/env";

export const dynamic = "force-dynamic";

const SMTP_FIELDS = [
  { label: "Host", key: "host" },
  { label: "Port", key: "port", hint: "For encrypted/TLS connections use 2465, 587, or 2587" },
  { label: "Username", key: "user" },
  { label: "Password", key: "password", hint: "Use any of your API keys as the password" },
] as const;

export default function SmtpPage() {
  const values: Record<string, string> = {
    host: env.SMTP_HOST,
    port: "465",
    user: env.SMTP_USER,
    password: "YOUR_API_KEY",
  };

  return (
    <Card className="max-w-2xl border-border/50">
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
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2">
          {SMTP_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {field.label}
              </label>
              <TextWithCopyButton
                className="mt-1.5 rounded-lg p-2.5 w-full bg-muted/50 border border-border/50 font-mono text-sm"
                value={values[field.key]!}
              />
              {'hint' in field && field.hint && (
                <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
