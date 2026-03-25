import { Button } from "@usesend/ui/src/button";
import { CodeBlock } from "@usesend/ui/src/code-block";
import { CodeBlockWithCopy } from "@usesend/ui/src/code-block-with-copy";
import { LangToggle } from "./CodeLangToggle";

const TS_CODE = `import { ByteSend } from "bytesend-js";

const client = new ByteSend("bs_12345");

client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "Hello from ByteSend",
  html: "<p>Sending emails has never been this easy with ByteSend.</p>",
  text: "Sending emails has never been this easy with ByteSend.",
});`;

const PY_CODE = `from bytesend import ByteSend

client = ByteSend("bs_12345")

data, err = client.emails.send({
    "to": "hello@acme.com",
    "from": "hello@company.com",
    "subject": "Hello from ByteSend",
    "html": "<p>Sending emails has never been this easy with ByteSend.</p>",
    "text": "Sending emails has never been this easy with ByteSend.",
})

print(data or err)`;

const GO_CODE = `package main

import (
    "fmt"
    "io"
    "net/http"
    "strings"
)

func main() {
    url := "https://bytesend.cloud/api/v1/emails"

    payload := strings.NewReader(\`{
     "to": "hello@acme.com",
     "from": "hello@company.com",
     "subject": "Hello from ByteSend",
     "html": "<p>Sending emails has never been this easy.</p>",
     "text": "Sending emails has never been this easy."
    }\`)

    req, _ := http.NewRequest("POST", url, payload)
    req.Header.Add("Content-Type", "application/json")
    req.Header.Add("Authorization", "Bearer bs_12345")

    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()

    body, _ := io.ReadAll(res.Body)
    fmt.Println(res)
    fmt.Println(string(body))
}`;

const PHP_CODE = `<?php

$ch = curl_init('https://bytesend.cloud/api/v1/emails');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'Authorization: Bearer bs_12345',
  ],
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    'to' => 'hello@acme.com',
    'from' => 'hello@company.com',
    'subject' => 'Hello from ByteSend',
    'html' => '<p>Sending emails has never been this easy.</p>',
    'text' => 'Sending emails has never been this easy.',
  ]),
]);

$response = curl_exec($ch);
if ($response === false) {
  echo 'cURL error: ' . curl_error($ch);
} else {
  echo $response;
}
curl_close($ch);`;

export function CodeExample() {
  const containerId = "code-example";
  const languages = [
    { key: "ts", label: "TypeScript", kind: "ts", shiki: "typescript" as const, code: TS_CODE },
    { key: "py", label: "Python", kind: "py", shiki: "python" as const, code: PY_CODE },
    { key: "go", label: "Go", kind: "go", shiki: "go" as const, code: GO_CODE },
    { key: "php", label: "PHP", kind: "php", shiki: "php" as const, code: PHP_CODE },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="mb-2 text-sm uppercase tracking-wider text-primary">
            Developers
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Typed SDKs and simple APIs, so you can focus on product not plumbing.
          </p>
        </div>

        <div className="mt-8 overflow-hidden" id={containerId}>
          <div className="flex items-center gap-2 justify-center py-2 text-xs text-muted-foreground mb-4">
            <LangToggle
              containerId={containerId}
              defaultLang="ts"
              languages={languages.map(({ key, label, kind }) => ({ key, label, kind }))}
            />
          </div>
          <div className="rounded-[18px] bg-primary/20 p-1">
            <div className="rounded-[14px] bg-primary/20 p-0.5 shadow-sm">
              <div className="bg-background rounded-xl overflow-hidden">
                {languages.map((l, idx) => (
                  <div
                    key={l.key}
                    data-lang-slot={l.key}
                    className={idx === 0 ? "block" : "hidden"}
                  >
                    <CodeBlockWithCopy code={l.code}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <CodeBlock lang={l.shiki as any} className="p-4 rounded-[10px]">
                        {l.code}
                      </CodeBlock>
                    </CodeBlockWithCopy>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sr-only" aria-live="polite">
            Language example toggled
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button size="lg" className="px-6">
            <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
              Read the docs
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CodeExample;
