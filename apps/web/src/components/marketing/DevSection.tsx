"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@bytesend/ui/src/button";
import { LangToggle } from "~/components/marketing/CodeLangToggle";

import { CheckIcon } from "~/components/marketing/HomeIcons";

export function DevSection() {

    const APP_URL = "/login";
    const containerId = "dev-lang-snippets";

    const TS_SNIPPET = `import { ByteSend } from "bytesend-js";

const client = new ByteSend("bs_••••••••");

await client.emails.send({
  to:      "user@acme.com",
  from:    "noreply@yourapp.com",
  subject: "Welcome to Acme!",
  html:    "<h1>Welcome aboard 🎉</h1>",
  text:    "Welcome aboard!",
});

// → { id: "em_abc123", success: true }`;

        const PY_SNIPPET = `from bytesend import ByteSend

client = ByteSend("bs_••••••••")

data, err = client.emails.send({
    "to": "user@acme.com",
    "from": "noreply@yourapp.com",
    "subject": "Welcome to Acme!",
    "html": "<h1>Welcome aboard 🎉</h1>",
    "text": "Welcome aboard!",
})

print(data or err)`;

        const GO_SNIPPET = `package main

import (
    "context"
    "log"

    bytesend "github.com/nodebyteltd/bytesend-go"
)

func main() {
    client, _ := bytesend.NewClient("bs_••••••••")

    resp, err := client.Emails.Create(context.Background(), bytesend.SendEmailPayload{
        From:    "noreply@yourapp.com",
        To:      []string{"user@acme.com"},
        Subject: "Welcome to Acme!",
        HTML:    "<h1>Welcome aboard 🎉</h1>",
        Text:    "Welcome aboard!",
    })
    if err != nil {
        log.Fatal(err)
    }

    log.Println(resp.EmailID)
}`;

        const PHP_SNIPPET = `<?php

$ch = curl_init('https://bytesend.cloud/api/v1/emails');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer bs_••••••••',
    ],
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'to' => 'user@acme.com',
        'from' => 'noreply@yourapp.com',
        'subject' => 'Welcome to Acme!',
        'html' => '<h1>Welcome aboard 🎉</h1>',
        'text' => 'Welcome aboard!',
    ]),
]);

$response = curl_exec($ch);
echo $response;
curl_close($ch);`;

        const RUST_SNIPPET = `use reqwest::Client;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();

    let response = client
        .post("https://bytesend.cloud/api/v1/emails")
        .bearer_auth("bs_••••••••")
        .json(&json!({
            "to": "user@acme.com",
            "from": "noreply@yourapp.com",
            "subject": "Welcome to Acme!",
            "html": "<h1>Welcome aboard 🎉</h1>",
            "text": "Welcome aboard!"
        }))
        .send()
        .await?;

    println!("{}", response.text().await?);
    Ok(())
}`;

        const RUBY_SNIPPET = `require "net/http"
require "json"

uri = URI("https://bytesend.cloud/api/v1/emails")
req = Net::HTTP::Post.new(uri)
req["Authorization"] = "Bearer bs_••••••••"
req["Content-Type"] = "application/json"
req.body = {
    to: "user@acme.com",
    from: "noreply@yourapp.com",
    subject: "Welcome to Acme!",
    html: "<h1>Welcome aboard 🎉</h1>",
    text: "Welcome aboard!"
}.to_json

res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
puts res.body`;

        const languages = [
                { key: "ts", label: "TypeScript", kind: "ts", code: TS_SNIPPET, file: "send-email.ts" },
                { key: "py", label: "Python", kind: "py", code: PY_SNIPPET, file: "send_email.py" },
                { key: "go", label: "Go", kind: "go", code: GO_SNIPPET, file: "send_email.go" },
                { key: "php", label: "PHP", kind: "php", code: PHP_SNIPPET, file: "send-email.php" },
                { key: "rs", label: "Rust", kind: "rs", code: RUST_SNIPPET, file: "send_email.rs" },
                { key: "rb", label: "Ruby", kind: "rb", code: RUBY_SNIPPET, file: "send_email.rb" },
        ];

    return (
        <section className="border-t border-border/30 bg-muted/20 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
                    {/* Left: text */}
                    <div className="lg:pt-4">
                        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Developer-first</p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Up and running<br />in minutes
                        </h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            Typed SDK for TypeScript. Simple REST API for every language. Fully documented,
                            consistently designed, with no surprises.
                        </p>

                        <ul className="mt-6 space-y-2.5">
                            {[
                                "TypeScript SDK with full type safety",
                                "Simple REST API with Bearer auth",
                                "Webhooks for real-time event delivery",
                                "Drop-in SMTP relay one config change",
                                "OpenAPI spec included",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Button className="rounded-xl" asChild>
                                <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
                                    View the docs
                                </a>
                            </Button>
                            <Button variant="outline" className="rounded-xl" asChild>
                                <Link href={APP_URL}>Get your API key</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: code block */}
                    <div className="rounded-xl border border-border/40 overflow-hidden" id={containerId}>
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-muted/40">
                            <div className="flex gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
                            </div>
                            <div className="ml-auto">
                                <LangToggle
                                    containerId={containerId}
                                    defaultLang="ts"
                                    languages={languages.map(({ key, label, kind }) => ({ key, label, kind }))}
                                />
                            </div>
                        </div>
                        {languages.map((lang, idx) => (
                            <div
                                key={lang.key}
                                data-lang-slot={lang.key}
                                className={idx === 0 ? "block" : "hidden"}
                            >
                                <div className="px-5 pt-3 text-[11px] text-muted-foreground font-mono bg-background/95 border-b border-border/20">
                                    {lang.file}
                                </div>
                                <pre className="px-5 py-5 text-[13px] font-mono leading-[1.7] overflow-x-auto text-foreground/85 bg-background">
                                    <code>{lang.code}</code>
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DevSection;
