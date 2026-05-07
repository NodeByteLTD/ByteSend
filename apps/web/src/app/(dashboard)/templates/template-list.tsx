"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@bytesend/ui/src/table";
import { api } from "~/trpc/react";
import { useUrlState } from "~/hooks/useUrlState";
import { Button } from "@bytesend/ui/src/button";
import Spinner from "@bytesend/ui/src/spinner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Input } from "@bytesend/ui/src/input";
import { Search, LayoutTemplate } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { TextWithCopyButton } from "@bytesend/ui/src/text-with-copy";
import DeleteTemplate from "./delete-template";
import DuplicateTemplate from "./duplicate-template";

export default function TemplateList() {
  const [page, setPage] = useUrlState("page", "1");
  const [search, setSearch] = useUrlState("search");

  const pageNumber = Number(page);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value || null);
    setPage("1");
  }, 500);

  const templateQuery = api.template.getTemplates.useQuery({
    page: pageNumber,
    search: search ?? undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search templates..."
          defaultValue={search ?? ""}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-col rounded-xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 hover:bg-muted/20">
              <TableHead className="rounded-tl-xl">Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Last Modified By</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="rounded-tr-xl">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templateQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center py-4">
                  <Spinner
                    className="w-6 h-6 mx-auto"
                    innerSvgClass="stroke-primary"
                  />
                </TableCell>
              </TableRow>
            ) : templateQuery.data?.templates.length ? (
              templateQuery.data.templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">
                    <Link
                      className="underline underline-offset-4 decoration-dashed text-foreground hover:text-foreground"
                      href={`/templates/${template.id}/edit`}
                    >
                      {template.name}
                    </Link>
                    {template.subject && (
                      <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                        {template.subject}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextWithCopyButton
                      value={template.id}
                      className="w-45 overflow-hidden"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {template.updatedBy ?? <span className="text-muted-foreground/50">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(template.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(template.updatedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <DuplicateTemplate template={template} />
                      <DeleteTemplate template={template} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-40">
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center text-center">
                    <LayoutTemplate className="h-7 w-7 text-muted-foreground/40 mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {search ? "No templates match your search" : "No templates yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {search
                        ? "Try a different search term"
                        : "Create a template to start designing reusable emails"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          size="sm"
          onClick={() => setPage((pageNumber - 1).toString())}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setPage((pageNumber + 1).toString())}
          disabled={pageNumber >= (templateQuery.data?.totalPage ?? 0)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

