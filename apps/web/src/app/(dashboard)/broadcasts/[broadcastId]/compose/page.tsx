"use client";

import { api } from "~/trpc/react";
import { Spinner } from "@bytesend/ui/src/spinner";
import { Button } from "@bytesend/ui/src/button";
import { Input } from "@bytesend/ui/src/input";
import { Editor } from "@bytesend/email-editor";
import { use, useMemo, useState } from "react";
import { Campaign } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@bytesend/ui/src/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@bytesend/ui/src/dialog";
import { toast } from "@bytesend/ui/src/toaster";
import { useDebouncedCallback } from "use-debounce";
import { formatDistanceToNow } from "date-fns";
import ScheduleCampaign from "../../../campaigns/schedule-campaign";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024;

function parseDirectRecipients(raw: string): string[] {
    return raw
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0 && e.includes("@"));
}

export default function BroadcastComposePage({
    params,
}: {
    params: Promise<{ broadcastId: string }>;
}) {
    const { broadcastId } = use(params);

    const {
        data: broadcast,
        isLoading,
        error,
    } = api.campaign.getCampaign.useQuery(
        { campaignId: broadcastId },
        { enabled: !!broadcastId },
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
                <p className="text-red-500">Failed to load broadcast</p>
            </div>
        );
    }

    if (!broadcast) {
        return <div>Broadcast not found</div>;
    }

    return <BroadcastComposer broadcast={broadcast} />;
}

function BroadcastComposer({
    broadcast,
}: {
    broadcast: Campaign & { contactBook: { id: string; name: string; emoji: string; _count?: { contacts: number } } | null; imageUploadSupported: boolean };
}) {
    const router = useRouter();
    const contactBooksQuery = api.contacts.getContactBooks.useQuery({});
    const utils = api.useUtils();

    const [json, setJson] = useState<Record<string, any> | undefined>(
        broadcast.content ? JSON.parse(broadcast.content) : undefined,
    );
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState(broadcast.name);
    const [subject, setSubject] = useState(broadcast.subject);
    const [from, setFrom] = useState(broadcast.from);
    const [replyTo, setReplyTo] = useState<string | undefined>(
        broadcast.replyTo[0],
    );

    const [recipientMode, setRecipientMode] = useState<"contactBook" | "direct">(
        broadcast.contactBookId ? "contactBook" : "direct",
    );
    const [contactBookId, setContactBookId] = useState<string | null | undefined>(
        broadcast.contactBookId,
    );
    const [directRecipients, setDirectRecipients] = useState<string>(
        broadcast.recipientEmails?.join("\n") ?? "",
    );

    const [sendNowOpen, setSendNowOpen] = useState(false);

    const updateCampaignMutation = api.campaign.updateCampaign.useMutation({
        onSuccess: () => {
            utils.campaign.getCampaign.invalidate();
            setIsSaving(false);
        },
    });

    const scheduleMutation = api.campaign.scheduleCampaign.useMutation();

    function updateEditorContent() {
        updateCampaignMutation.mutate({
            campaignId: broadcast.id,
            content: JSON.stringify(json),
        });
    }

    const debouncedUpdateCampaign = useDebouncedCallback(updateEditorContent, 1000);

    const handleFileChange = async (file: File) => {
        if (file.size > IMAGE_SIZE_LIMIT) {
            throw new Error(
                `File should be less than ${IMAGE_SIZE_LIMIT / 1024 / 1024}MB`,
            );
        }

        const fd = new FormData();
        fd.append("file", file);
        fd.append("teamId", String(broadcast.teamId));
        fd.append("type", "asset");

        const response = await fetch("/api/upload", { method: "POST", body: fd });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error((err as any)?.error ?? "Failed to upload file");
        }
        const { publicUrl } = (await response.json()) as { publicUrl: string };
        return publicUrl;
    };

    const contactBook = contactBooksQuery.data?.find(
        (book) => book.id === contactBookId,
    );

    const editorVariables = useMemo(() => {
        if (recipientMode === "direct") return [];
        const baseVariables = ["email", "firstName", "lastName"];
        const registryVariables = contactBook?.variables ?? [];
        return Array.from(new Set([...baseVariables, ...registryVariables]));
    }, [contactBook, recipientMode]);

    const parsedDirectEmails = useMemo(
        () => parseDirectRecipients(directRecipients),
        [directRecipients],
    );

    const recipientCount =
        recipientMode === "direct"
            ? parsedDirectEmails.length
            : contactBook?._count?.contacts ?? 0;

    async function saveAll() {
        if (recipientMode === "direct") {
            await new Promise<void>((resolve, reject) => {
                updateCampaignMutation.mutate(
                    {
                        campaignId: broadcast.id,
                        recipientEmails: parsedDirectEmails,
                        subject,
                        from,
                        replyTo: replyTo ? [replyTo] : [],
                    },
                    { onSuccess: () => resolve(), onError: reject },
                );
            });
        } else {
            await new Promise<void>((resolve, reject) => {
                updateCampaignMutation.mutate(
                    {
                        campaignId: broadcast.id,
                        contactBookId: contactBookId ?? undefined,
                        subject,
                        from,
                        replyTo: replyTo ? [replyTo] : [],
                    },
                    { onSuccess: () => resolve(), onError: reject },
                );
            });
        }
    }

    async function handleSendNow() {
        try {
            await saveAll();
        } catch {
            toast.error("Failed to save broadcast before sending");
            return;
        }
        scheduleMutation.mutate(
            { campaignId: broadcast.id },
            {
                onSuccess: () => {
                    toast.success("Broadcast sent!");
                    setSendNowOpen(false);
                    router.push(`/broadcasts/${broadcast.id}`);
                },
                onError: (e) => toast.error(e.message),
            },
        );
    }

    return (
        <div className="-mx-4 md:-mx-6 flex flex-col h-full min-h-screen">
            {/* Sticky top bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 h-12 shrink-0 border-b border-border/60 bg-background/95 backdrop-blur">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href="/broadcasts"
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-0 focus:ring-0 focus:outline-none bg-transparent h-auto p-0 font-medium text-sm min-w-0"
                        onBlur={() => {
                            if (!name || name === broadcast.name) return;
                            updateCampaignMutation.mutate(
                                { campaignId: broadcast.id, name },
                                {
                                    onError: (e) => {
                                        toast.error(`${e.message}. Reverting changes.`);
                                        setName(broadcast.name);
                                    },
                                },
                            );
                        }}
                    />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        {isSaving ? (
                            <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                        ) : (
                            <div className="h-2 w-2 bg-green-500 rounded-full" />
                        )}
                        <span className="text-xs hidden sm:block">
                            {formatDistanceToNow(broadcast.updatedAt) === "less than a minute"
                                ? "just now"
                                : `${formatDistanceToNow(broadcast.updatedAt)} ago`}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSendNowOpen(true)}
                    >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send Now
                    </Button>
                    <ScheduleCampaign
                        campaign={broadcast}
                        onScheduled={() => router.push(`/broadcasts/${broadcast.id}`)}
                    />
                </div>
            </div>

            {/* Body: sidebar + editor */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <aside className="w-80 shrink-0 border-r border-border/60 overflow-y-auto p-4 space-y-5">
                    {/* Recipients section */}
                    <div>
                        <p className="text-sm font-semibold mb-2">Recipients</p>
                        <div className="flex rounded-lg border border-border/60 overflow-hidden mb-3">
                            <button
                                type="button"
                                onClick={() => setRecipientMode("contactBook")}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${recipientMode === "contactBook"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Contact Book
                            </button>
                            <button
                                type="button"
                                onClick={() => setRecipientMode("direct")}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${recipientMode === "direct"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Direct Recipients
                            </button>
                        </div>

                        {recipientMode === "contactBook" ? (
                            contactBooksQuery.isLoading ? (
                                <Spinner className="w-4 h-4" />
                            ) : (
                                <Select
                                    value={contactBookId ?? ""}
                                    onValueChange={(val) => {
                                        setContactBookId(val);
                                        updateCampaignMutation.mutate(
                                            { campaignId: broadcast.id, contactBookId: val },
                                            { onError: () => setContactBookId(broadcast.contactBookId) },
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-full text-xs">
                                        {contactBook
                                            ? `${contactBook.emoji} ${contactBook.name}`
                                            : "Select a contact book"}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contactBooksQuery.data?.map((book) => (
                                            <SelectItem key={book.id} value={book.id}>
                                                {book.emoji} {book.name}
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    {book._count.contacts} contacts
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                        ) : (
                            <div className="space-y-1.5">
                                <textarea
                                    placeholder={"One email per line, or comma-separated\nalice@example.com\nbob@example.com"}
                                    value={directRecipients}
                                    onChange={(e) => setDirectRecipients(e.target.value)}
                                    className="w-full h-32 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                {parsedDirectEmails.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {parsedDirectEmails.length} recipient
                                        {parsedDirectEmails.length !== 1 ? "s" : ""}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* From / Subject / ReplyTo */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold">Message</p>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                onBlur={() => {
                                    if (!subject || subject === broadcast.subject) return;
                                    updateCampaignMutation.mutate(
                                        { campaignId: broadcast.id, subject },
                                        {
                                            onError: (e) => {
                                                toast.error(`${e.message}. Reverting.`);
                                                setSubject(broadcast.subject);
                                            },
                                        },
                                    );
                                }}
                                className="w-full text-sm outline-none border border-border/60 rounded-lg bg-background px-3 py-1.5 focus:ring-1 focus:ring-primary"
                                placeholder="What's new this week"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">From</label>
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                onBlur={() => {
                                    if (!from || from === broadcast.from) return;
                                    updateCampaignMutation.mutate(
                                        { campaignId: broadcast.id, from },
                                        {
                                            onError: (e) => {
                                                toast.error(`${e.message}. Reverting.`);
                                                setFrom(broadcast.from);
                                            },
                                        },
                                    );
                                }}
                                className="w-full text-sm outline-none border border-border/60 rounded-lg bg-background px-3 py-1.5 focus:ring-1 focus:ring-primary"
                                placeholder="Updates <updates@example.com>"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Reply To</label>
                            <input
                                type="text"
                                value={replyTo ?? ""}
                                onChange={(e) => setReplyTo(e.target.value)}
                                onBlur={() => {
                                    if (replyTo === broadcast.replyTo[0]) return;
                                    updateCampaignMutation.mutate(
                                        {
                                            campaignId: broadcast.id,
                                            replyTo: replyTo ? [replyTo] : [],
                                        },
                                        {
                                            onError: (e) => {
                                                toast.error(`${e.message}. Reverting.`);
                                                setReplyTo(broadcast.replyTo[0]);
                                            },
                                        },
                                    );
                                }}
                                className="w-full text-sm outline-none border border-border/60 rounded-lg bg-background px-3 py-1.5 focus:ring-1 focus:ring-primary"
                                placeholder="hello@example.com"
                            />
                        </div>
                    </div>

                    {/* Recipient summary */}
                    {recipientCount > 0 && (
                        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                            <p className="text-xs text-muted-foreground">
                                Sending to{" "}
                                <span className="font-semibold text-foreground">
                                    {recipientCount.toLocaleString()}
                                </span>{" "}
                                recipient{recipientCount !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </aside>

                {/* Editor */}
                <div className="flex-1 overflow-hidden bg-muted/10">
                    <Editor
                        key={`broadcast-editor-${contactBookId ?? "none"}-${recipientMode}`}
                        initialContent={json}
                        onUpdate={(content) => {
                            setJson(content.getJSON());
                            setIsSaving(true);
                            debouncedUpdateCampaign();
                        }}
                        variables={editorVariables}
                        variableSuggestionsHelperText={
                            recipientMode === "direct"
                                ? "Variable substitution is not available for direct recipients"
                                : recipientMode === "contactBook" && !contactBookId
                                    ? "Select a contact book for variable suggestions"
                                    : undefined
                        }
                        uploadImage={
                            broadcast.imageUploadSupported ? handleFileChange : undefined
                        }
                    />
                </div>
            </div>

            {/* Send Now confirmation dialog */}
            <Dialog open={sendNowOpen} onOpenChange={setSendNowOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send broadcast now?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        This will immediately send to{" "}
                        <span className="font-semibold text-foreground">
                            {recipientCount}
                        </span>{" "}
                        recipient{recipientCount !== 1 ? "s" : ""}. This action cannot be
                        undone.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setSendNowOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendNow}
                            isLoading={scheduleMutation.isPending}
                            className="flex-1"
                        >
                            Send Now
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
