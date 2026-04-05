"use client";

import AddApiKey from "./api-keys/add-api-key";
import ApiList from "./api-keys/api-list";
import { H1 } from "@bytesend/ui";

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>API Keys</H1>
          <p className="text-sm text-muted-foreground mt-1">Manage API keys for programmatic access</p>
        </div>
        <AddApiKey />
      </div>
      <ApiList />
    </div>
  );
}
