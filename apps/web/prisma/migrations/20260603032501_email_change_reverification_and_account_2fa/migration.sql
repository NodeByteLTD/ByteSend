-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "twoFactorTempSecret" TEXT;

-- CreateTable
CREATE TABLE "PendingEmailChange" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "newEmail" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingEmailChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PendingEmailChange_expiresAt_idx" ON "PendingEmailChange"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PendingEmailChange_userId_newEmail_key" ON "PendingEmailChange"("userId", "newEmail");

-- AddForeignKey
ALTER TABLE "PendingEmailChange" ADD CONSTRAINT "PendingEmailChange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
