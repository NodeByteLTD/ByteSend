import { NextResponse } from "next/server";
import { env } from "~/env";

const GITHUB_REPO = "NodeByteHosting/ByteSend-Cloud";
const FALLBACK_VERSION = "canary";

// Injected at build time by CI (e.g. NEXT_PUBLIC_APP_VERSION=v0.2.0).
// Highest priority — no network call needed.
// Treat absent / sentinel values as unset so we fall through to the API lookup.
const _buildVersion = process.env.NEXT_PUBLIC_APP_VERSION;
const BUILD_VERSION =
  _buildVersion && _buildVersion !== "unknown" && _buildVersion !== "canary"
    ? _buildVersion
    : null;

export const revalidate = 3600; // re-validate at most once per hour

/** Tries GitLab: permalink/latest first, then releases list, then tags. */
async function fetchFromGitLab(): Promise<string | null> {
  const base = env.GITLAB_URL;
  const repoId = env.GITLAB_REPO_ID;
  if (!base || !repoId) return null;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (env.GITLAB_RELEASE_TOKEN) {
    headers["PRIVATE-TOKEN"] = env.GITLAB_RELEASE_TOKEN;
  }

  const encodedId = encodeURIComponent(repoId);

  // 1. permalink/latest (GitLab 14.2+)
  try {
    const res = await fetch(
      `${base}/api/v4/projects/${encodedId}/releases/permalink/latest`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string };
      if (data.tag_name) return data.tag_name;
    }
  } catch (err) {
    console.error("[version] GitLab permalink/latest failed:", err);
  }

  // 2. releases list (works on older GitLab)
  try {
    const res = await fetch(
      `${base}/api/v4/projects/${encodedId}/releases?per_page=1&order_by=released_at&sort=desc`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string }[];
      if (Array.isArray(data) && data[0]?.tag_name) return data[0].tag_name;
    }
  } catch (err) {
    console.error("[version] GitLab releases list failed:", err);
  }

  // 3. repository tags (last resort — any repo with tags)
  try {
    const res = await fetch(
      `${base}/api/v4/projects/${encodedId}/repository/tags?per_page=1&order_by=updated&sort=desc`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { name?: string }[];
      if (Array.isArray(data) && data[0]?.name) return data[0].name;
    }
  } catch (err) {
    console.error("[version] GitLab tags failed:", err);
  }

  return null;
}

/** Tries GitHub: releases/latest, then first release from list. */
async function fetchFromGitHub(): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.GITHUB_RELEASE_TOKEN) {
    headers["Authorization"] = `Bearer ${env.GITHUB_RELEASE_TOKEN}`;
  }

  // 1. latest release
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string };
      if (data.tag_name) return data.tag_name;
    }
  } catch (err) {
    console.error("[version] GitHub releases/latest failed:", err);
  }

  // 2. releases list (handles repos where latest returns 404)
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=1`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string }[];
      if (Array.isArray(data) && data[0]?.tag_name) return data[0].tag_name;
    }
  } catch (err) {
    console.error("[version] GitHub releases list failed:", err);
  }

  // 3. tags (catches repos that use tags but not formal releases)
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/tags?per_page=1`,
      { headers, next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { name?: string }[];
      if (Array.isArray(data) && data[0]?.name) return data[0].name;
    }
  } catch (err) {
    console.error("[version] GitHub tags failed:", err);
  }

  return null;
}

export async function GET() {
  // 1. Build-time injection (CI sets NEXT_PUBLIC_APP_VERSION before `next build`)
  if (BUILD_VERSION) {
    return NextResponse.json({ version: BUILD_VERSION });
  }

  // 2. Runtime: GitLab → GitHub → canary
  const version =
    (await fetchFromGitLab()) ??
    (await fetchFromGitHub()) ??
    FALLBACK_VERSION;

  return NextResponse.json({ version });
}

