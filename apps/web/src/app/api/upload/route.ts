import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { uploadObject, isStorageConfigured } from "~/server/service/storage-service";
import { nanoid } from "~/server/nanoid";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Object storage is not configured" },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const teamIdRaw = formData.get("teamId");
  const type = formData.get("type") ?? "asset";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File must be smaller than 5 MB" },
      { status: 400 },
    );
  }

  const teamId = teamIdRaw ? Number(teamIdRaw) : null;
  if (!teamId || isNaN(teamId)) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }

  // Verify the user is a member of the requested team
  const membership = await db.teamUser.findFirst({
    where: { teamId, userId: session.user.id },
  });
  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key =
    type === "team-image"
      ? `team-images/${teamId}/${Date.now()}.${ext}`
      : `${teamId}/${nanoid()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const publicUrl = await uploadObject(key, buffer, file.type);
    return NextResponse.json({ publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
