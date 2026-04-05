"use client";

import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";
import DeleteContactBook from "./delete-contact-book";
import Link from "next/link";
import EditContactBook from "./edit-contact-book";
import { useRouter } from "next/navigation";
import { useUrlState } from "~/hooks/useUrlState";
import { Input } from "@bytesend/ui/src/input";
import { useDebouncedCallback } from "use-debounce";

export default function ContactBooksList() {
  const [search, setSearch] = useUrlState("search");
  const contactBooksQuery = api.contacts.getContactBooks.useQuery({
    search: search ?? undefined,
  });

  const router = useRouter();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 1000);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search contact books..."
        className="w-full sm:w-72"
        defaultValue={search ?? ""}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactBooksQuery.data?.map((contactBook) => (
          <div
            key={contactBook.id}
            className="border border-border/60 rounded-xl overflow-hidden hover:border-border transition-colors"
          >
            <Link href={`/contacts/${contactBook.id}`}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{contactBook.emoji || "📋"}</span>
                  <span className="font-medium text-sm truncate">
                    {contactBook.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-3 font-mono">
                  {contactBook._count.contacts}
                </span>
              </div>
            </Link>
            <div className="flex items-center justify-between border-t border-border/40 bg-muted/30 px-4 py-2.5">
              <span
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={() => router.push(`/contacts/${contactBook.id}`)}
              >
                {formatDistanceToNow(contactBook.createdAt, { addSuffix: true })}
              </span>
              <div className="flex gap-2">
                <EditContactBook contactBook={contactBook} />
                <DeleteContactBook contactBook={contactBook} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
