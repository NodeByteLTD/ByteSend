"use client";

import { api } from "~/trpc/react";
import { Spinner } from "@bytesend/ui/src/spinner";
import { Input } from "@bytesend/ui/src/input";
import { Editor } from "@bytesend/email-editor";
import { useState } from "react";
import { Template } from "@prisma/client";
import { toast } from "@bytesend/ui/src/toaster";
import { useDebouncedCallback } from "use-debounce";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024;

export default function EditTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);

  const {
    data: template,
    isLoading,
    error,
  } = api.template.getTemplate.useQuery(
    { templateId: templateId },
    {
      enabled: !!templateId,
    },
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Failed to load template</p>
      </div>
    );
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return <TemplateEditor template={template} />;
}

function TemplateEditor({
  template,
}: {
  template: Template & { imageUploadSupported: boolean };
}) {
  const utils = api.useUtils();

  const [json, setJson] = useState<Record<string, any> | undefined>(
    template.content ? JSON.parse(template.content) : undefined,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);

  const updateTemplateMutation = api.template.updateTemplate.useMutation({
    onSuccess: () => {
      utils.template.getTemplate.invalidate();
      setIsSaving(false);
    },
  });

  function updateEditorContent() {
    updateTemplateMutation.mutate({
      templateId: template.id,
      content: JSON.stringify(json),
    });
  }

  const deboucedUpdateTemplate = useDebouncedCallback(
    updateEditorContent,
    1000,
  );

  const handleFileChange = async (file: File) => {
    if (file.size > IMAGE_SIZE_LIMIT) {
      throw new Error(
        `File should be less than ${IMAGE_SIZE_LIMIT / 1024 / 1024}MB`,
      );
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("teamId", String(template.teamId));
    fd.append("type", "asset");

    const response = await fetch("/api/upload", { method: "POST", body: fd });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as any)?.error ?? "Failed to upload file");
    }
    const { publicUrl } = await response.json() as { publicUrl: string };
    return publicUrl;
  };

  return (
    <div className="p-4 container mx-auto">
      <div className="mx-auto">
        <div className="mb-4 flex justify-between items-center w-full sm:w-175 mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" border-0 focus:ring-0 focus:outline-none px-0.5 w-full sm:w-75"
              onBlur={() => {
                if (name === template.name || !name) {
                  return;
                }
                updateTemplateMutation.mutate(
                  {
                    templateId: template.id,
                    name,
                  },
                  {
                    onError: (e) => {
                      toast.error(`${e.message}. Reverting changes.`);
                      setName(template.name);
                    },
                  },
                );
              }}
            />
          </div>

          <div className="flex items-center gap-4 whitespace-nowrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <div className="h-2 w-2 bg-yellow rounded-full" />
              ) : (
                <div className="h-2 w-2 bg-green rounded-full" />
              )}
              {formatDistanceToNow(template.updatedAt) === "less than a minute"
                ? "just now"
                : `${formatDistanceToNow(template.updatedAt)} ago`}
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4 mb-4 p-4 w-full sm:w-175 mx-auto z-50">
          <div className="flex items-center gap-4">
            <label className="block text-sm w-20 text-muted-foreground">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              onBlur={() => {
                if (subject === template.subject || !subject) {
                  return;
                }
                updateTemplateMutation.mutate(
                  {
                    templateId: template.id,
                    subject,
                  },
                  {
                    onError: (e) => {
                      toast.error(`${e.message}. Reverting changes.`);
                      setSubject(template.subject);
                    },
                  },
                );
              }}
              className="mt-1 py-1 text-sm block w-full outline-none border-b border-transparent focus:border-border bg-transparent"
            />
          </div>
        </div>

        {/* Variables tip strip */}
        <div className="w-full sm:w-175 mx-auto mb-3 px-4 sm:px-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Variables:</span>
            {["{{email}}", "{{firstName}}", "{{lastName}}"].map((v) => (
              <code
                key={v}
                className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border/60 text-[11px]"
              >
                {v}
              </code>
            ))}
            <span className="text-border/80">·</span>
            <span>
              Type <code className="font-mono bg-muted px-1 py-0.5 rounded border border-border/60 text-[11px]">/</code> for formatting blocks
            </span>
            <span className="text-border/80">·</span>
            <span>Use <code className="font-mono bg-muted px-1 py-0.5 rounded border border-border/60 text-[11px]">{"{{variableName,fallback=Default}}"}</code> for fallbacks</span>
          </div>
        </div>

        {/* Editor canvas — white background is intentional (email clients render on white) */}
        <div className="w-full sm:w-175 mx-auto rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Email canvas</span>
            <span className="text-[11px] text-muted-foreground/50">White background matches how email clients render</span>
          </div>
          <div className="p-4 sm:p-8">
            <div className="w-full sm:w-150 mx-auto">
            <Editor
              initialContent={json}
              onUpdate={(content) => {
                setJson(content.getJSON());
                setIsSaving(true);
                deboucedUpdateTemplate();
              }}
              variables={["email", "firstName", "lastName"]}
              uploadImage={
                template.imageUploadSupported ? handleFileChange : undefined
              }
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
