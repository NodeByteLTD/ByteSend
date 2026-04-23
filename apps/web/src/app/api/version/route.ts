import { NextResponse } from "next/server";
import { env } from "~/env";

const GITHUB_REPO = "NodeByteHosting/ByteSend-Cloud";
const FALLBACK_VERSION = "canary";

export const revalidate = 3600; // re-fetch at most once per hour

async function fetchFromGitLab(): Promise<string | null> {
  if (!env.GITLAB_URL || !env.GITLAB_REPO_ID) return null;

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (env.GITLAB_RELEASE_TOKEN) {
      headers["PRIVATE-TOKEN"] = env.GITLAB_RELEASE_TOKEN;
    }

    const res = await fetch(
      `${env.GITLAB_URL}/api/v4/projects/${encodeURIComponent(env.GITLAB_REPO_ID)}/releases/permalink/latest`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!res.ok) return null;

    const data = (await res.json()) as { tag_name?: string };
    return data.tag_name ?? null;
  } catch {
    return null;
  }
}

async function fetchFromGitHub(): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (env.GITHUB_RELEASE_TOKEN) {
      headers["Authorization"] = `Bearer ${env.GITHUB_RELEASE_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!res.ok) return null;

    const data = (await res.json()) as { tag_name?: string };
    return data.tag_name ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  // Prefer GitLab (self-hosted), fall back to GitHub, then canary
  const version =
    (await fetchFromGitLab()) ??
    (await fetchFromGitHub()) ??
    FALLBACK_VERSION;

  return NextResponse.json({ version });
}
