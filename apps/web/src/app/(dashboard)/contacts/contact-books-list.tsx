"use client";

import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";
import DeleteContactBook from "./delete-contact-book";
import Link from "next/link";
import EditContactBook from "./edit-contact-book";
import { useRouter } from "next/navigation";
import { useUrlState } from "~/hooks/useUrlState";
import { Input } from "@bytesend/ui/src/input";
import { Skeleton } from "@bytesend/ui/src/skeleton";
import { useDebouncedCallback } from "use-debounce";
import { BookUser, Users } from "lucide-react";

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

      {contactBooksQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-22 rounded-xl" />
          ))}
        </div>
      ) : !contactBooksQuery.data?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 rounded-xl">
          <BookUser className="h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-foreground">
            {search ? "No contact books match your search" : "No contact books yet"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {search
              ? "Try a different search term"
              : "Create a contact book to start organising your contacts"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactBooksQuery.data.map((contactBook) => (
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
                  <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-3 font-mono tabular-nums">
                    <Users className="h-3 w-3" />
                    {contactBook._count.contacts.toLocaleString()}
                  </span>
                </div>
              </Link>
              <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-4 py-2.5">
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
      )}
    </div>
  );
}
