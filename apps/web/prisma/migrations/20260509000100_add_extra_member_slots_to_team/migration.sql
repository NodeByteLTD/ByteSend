-- Add missing Team extra member slots column expected by Prisma schema and tests
ALTER TABLE "Team"
ADD COLUMN IF NOT EXISTS "extraMemberSlots" INTEGER NOT NULL DEFAULT 0;
