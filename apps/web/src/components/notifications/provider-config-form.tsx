import React from "react";
import { Input } from "@bytesend/ui/src/input";
import { Label } from "@bytesend/ui/src/label";
import { Textarea } from "@bytesend/ui/src/textarea";
import { Badge } from "@bytesend/ui/src/badge";

interface ProviderConfigFormProps {
  type: string;
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  errors?: Record<string, string>;
}

/**
 * Discord Provider Configuration Form
 */
export function DiscordConfigForm({
  config,
  onChange,
  errors = {},
}: Omit<ProviderConfigFormProps, "type">) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="discord-webhook">Discord Webhook URL *</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Get this from Server Settings → Integrations → Webhooks in Discord
        </p>
        <Input
          id="discord-webhook"
          type="password"
          placeholder="https://discord.com/api/webhooks/..."
          value={config.webhookUrl || ""}
          onChange={(e) => onChange({ ...config, webhookUrl: e.target.value })}
          className={errors.webhookUrl ? "border-red-500" : ""}
        />
        {errors.webhookUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.webhookUrl}</p>
        )}
      </div>

      <div>
        <Label htmlFor="discord-role">Role to Mention (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Role ID to mention when sending notifications
        </p>
        <Input
          id="discord-role"
          placeholder="123456789..."
          value={config.mentionRole || ""}
          onChange={(e) => onChange({ ...config, mentionRole: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="discord-thread">Thread ID (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Send messages to a specific thread
        </p>
        <Input
          id="discord-thread"
          placeholder="123456789..."
          value={config.threadId || ""}
          onChange={(e) => onChange({ ...config, threadId: e.target.value })}
        />
      </div>
    </div>
  );
}

/**
 * Slack Provider Configuration Form
 */
export function SlackConfigForm({
  config,
  onChange,
  errors = {},
}: Omit<ProviderConfigFormProps, "type">) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="slack-webhook">Slack Webhook URL *</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Get this from your Slack app&apos;s Incoming Webhooks settings
        </p>
        <Input
          id="slack-webhook"
          type="password"
          placeholder="https://hooks.slack.com/services/..."
          value={config.webhookUrl || ""}
          onChange={(e) => onChange({ ...config, webhookUrl: e.target.value })}
          className={errors.webhookUrl ? "border-red-500" : ""}
        />
        {errors.webhookUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.webhookUrl}</p>
        )}
      </div>

      <div>
        <Label htmlFor="slack-channel">Channel ID (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Override the default channel for this webhook
        </p>
        <Input
          id="slack-channel"
          placeholder="C123456789..."
          value={config.channelId || ""}
          onChange={(e) => onChange({ ...config, channelId: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="slack-bot">Bot Token (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          For advanced features and better formatting
        </p>
        <Input
          id="slack-bot"
          type="password"
          placeholder="xoxb-..."
          value={config.botToken || ""}
          onChange={(e) => onChange({ ...config, botToken: e.target.value })}
        />
      </div>
    </div>
  );
}

/**
 * Microsoft Teams Provider Configuration Form
 */
export function MicrosoftTeamsConfigForm({
  config,
  onChange,
  errors = {},
}: Omit<ProviderConfigFormProps, "type">) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="teams-webhook">Microsoft Teams Webhook URL *</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Get this from Configure Connector → Incoming Webhook in Teams
        </p>
        <Input
          id="teams-webhook"
          type="password"
          placeholder="https://outlook.webhook.office.com/webhookb2/..."
          value={config.webhookUrl || ""}
          onChange={(e) => onChange({ ...config, webhookUrl: e.target.value })}
          className={errors.webhookUrl ? "border-red-500" : ""}
        />
        {errors.webhookUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.webhookUrl}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="adaptive-card"
          type="checkbox"
          checked={config.adaptiveCard || false}
          onChange={(e) =>
            onChange({ ...config, adaptiveCard: e.target.checked })
          }
          className="rounded border-gray-300"
        />
        <Label htmlFor="adaptive-card">Use Adaptive Cards (Better Formatting)</Label>
      </div>
    </div>
  );
}

/**
 * Telegram Provider Configuration Form
 */
export function TelegramConfigForm({
  config,
  onChange,
  errors = {},
}: Omit<ProviderConfigFormProps, "type">) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="telegram-token">Telegram Bot Token *</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Create a bot with @BotFather on Telegram
        </p>
        <Input
          id="telegram-token"
          type="password"
          placeholder="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh"
          value={config.botToken || ""}
          onChange={(e) => onChange({ ...config, botToken: e.target.value })}
          className={errors.botToken ? "border-red-500" : ""}
        />
        {errors.botToken && (
          <p className="text-red-500 text-sm mt-1">{errors.botToken}</p>
        )}
      </div>

      <div>
        <Label htmlFor="telegram-chat">Chat ID *</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Use @userinfobot to find your chat ID
        </p>
        <Input
          id="telegram-chat"
          placeholder="123456789"
          value={config.chatId || ""}
          onChange={(e) => onChange({ ...config, chatId: e.target.value })}
          className={errors.chatId ? "border-red-500" : ""}
        />
        {errors.chatId && (
          <p className="text-red-500 text-sm mt-1">{errors.chatId}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Custom Webhook Provider Configuration Form
 */
export function CustomWebhookConfigForm({
  config,
  onChange,
  errors = {},
}: Omit<ProviderConfigFormProps, "type">) {
  const headerEntries = Object.entries(config.headers || {});

  const addHeader = () => {
    onChange({
      ...config,
      headers: { ...config.headers, "": "" },
    });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...config.headers };
    delete newHeaders[oldKey];
    newHeaders[newKey] = value;
    onChange({ ...config, headers: newHeaders });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...config.headers };
    delete newHeaders[key];
    onChange({ ...config, headers: newHeaders });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="custom-url">Webhook URL *</Label>
        <Input
          id="custom-url"
          type="url"
          placeholder="https://api.example.com/notifications"
          value={config.url || ""}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          className={errors.url ? "border-red-500" : ""}
        />
        {errors.url && (
          <p className="text-red-500 text-sm mt-1">{errors.url}</p>
        )}
      </div>

      <div>
        <Label htmlFor="custom-secret">Signature Secret (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Used to sign requests with HMAC-SHA256. Header: X-ByteSend-Signature
        </p>
        <Input
          id="custom-secret"
          type="password"
          placeholder="your-secret-key"
          value={config.secret || ""}
          onChange={(e) => onChange({ ...config, secret: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Custom Headers</Label>
          <button
            type="button"
            onClick={addHeader}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Header
          </button>
        </div>

        <div className="space-y-2">
          {headerEntries.map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Header name"
                value={key}
                onChange={(e) => updateHeader(key, e.target.value, value)}
                className="flex-1"
              />
              <Input
                placeholder="Header value"
                type="password"
                value={value as string}
                onChange={(e) => updateHeader(key, key, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeHeader(key)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Provider Configuration Form Dispatcher
 */
export function ProviderConfigForm(props: ProviderConfigFormProps) {
  switch (props.type) {
    case "DISCORD":
      return <DiscordConfigForm config={props.config} onChange={props.onChange} errors={props.errors} />;
    case "SLACK":
      return <SlackConfigForm config={props.config} onChange={props.onChange} errors={props.errors} />;
    case "MICROSOFT_TEAMS":
      return <MicrosoftTeamsConfigForm config={props.config} onChange={props.onChange} errors={props.errors} />;
    case "TELEGRAM":
      return <TelegramConfigForm config={props.config} onChange={props.onChange} errors={props.errors} />;
    case "CUSTOM_WEBHOOK":
      return <CustomWebhookConfigForm config={props.config} onChange={props.onChange} errors={props.errors} />;
    default:
      return null;
  }
}

/**
 * Provider type badge with color
 */
export function ProviderTypeBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    DISCORD: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Discord",
    },
    SLACK: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Slack",
    },
    MICROSOFT_TEAMS: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Teams",
    },
    TELEGRAM: {
      bg: "bg-cyan-100",
      text: "text-cyan-700",
      label: "Telegram",
    },
    CUSTOM_WEBHOOK: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: "Custom Webhook",
    },
  };

  const color = colors[type] || colors.CUSTOM_WEBHOOK;

  return (
    <Badge variant="secondary" className={`${color.bg} ${color.text}`}>
      {color.label}
    </Badge>
  );
}
