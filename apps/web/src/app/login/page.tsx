import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import LoginPage from "./login-page";
import { getProviders } from "next-auth/react";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [session, params] = await Promise.all([
    getServerAuthSession(),
    searchParams,
  ]);

  if (session) {
    redirect("/dashboard");
  }

  if (params.error === "banned") {
    redirect("/banned");
  }

  const providers = await getProviders();

  return <LoginPage providers={Object.values(providers ?? {})} />;
}
