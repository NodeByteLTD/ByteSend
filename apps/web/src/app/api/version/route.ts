import { NextResponse } from "next/server";
import { env } from "~/env";

const REPO = "NodeByteHosting/ByteSend-Cloud";
const FALLBACK_VERSION = "v1.0.0-beta.1";

export const revalidate = 3600; // re-fetch from GitHub at most once per hour

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (env.GITHUB_RELEASE_TOKEN) {
      headers["Authorization"] = `Bearer ${env.GITHUB_RELEASE_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      return NextResponse.json({ version: FALLBACK_VERSION });
    }

    const data = (await res.json()) as { tag_name?: string };
    const version = data.tag_name ?? FALLBACK_VERSION;

    return NextResponse.json({ version });
  } catch {
    return NextResponse.json({ version: FALLBACK_VERSION });
  }
}
