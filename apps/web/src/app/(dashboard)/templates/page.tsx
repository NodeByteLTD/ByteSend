"use client";

import TemplateList from "./template-list";
import CreateTemplate from "./create-template";
import { H1 } from "@bytesend/ui";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Templates</H1>
          <p className="text-sm text-muted-foreground mt-1">Design reusable email templates</p>
        </div>
        <CreateTemplate />
      </div>
      <TemplateList />
    </div>
  );
}
