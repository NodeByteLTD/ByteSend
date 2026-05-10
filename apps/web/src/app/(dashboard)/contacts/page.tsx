"use client";

import AddContactBook from "./add-contact-book";
import ContactBooksList from "./contact-books-list";
import { H1 } from "@bytesend/ui";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Contact books</H1>
          <p className="text-sm text-muted-foreground mt-1">Organize your contacts into lists</p>
        </div>
        <AddContactBook />
      </div>
      <ContactBooksList />
    </div>
  );
}
