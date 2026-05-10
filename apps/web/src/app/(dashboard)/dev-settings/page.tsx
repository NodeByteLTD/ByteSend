import { redirect } from "next/navigation";

export default function DevSettingsPage() {
  redirect("/settings/api-keys");
}
