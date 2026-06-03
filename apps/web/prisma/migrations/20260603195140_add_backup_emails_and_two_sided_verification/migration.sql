/*
  Warnings:

  - You are about to drop the column `code` on the `PendingEmailChange` table. All the data in the column will be lost.
  - Added the required column `codeNew` to the `PendingEmailChange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingEmailChange" DROP COLUMN "code",
ADD COLUMN     "codeNew" TEXT NOT NULL,
ADD COLUMN     "codeOld" TEXT,
ADD COLUMN     "verifiedNew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedOld" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BackupEmail" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingBackupEmailVerification" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingBackupEmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BackupEmail_email_key" ON "BackupEmail"("email");

-- CreateIndex
CREATE INDEX "BackupEmail_userId_emailVerified_idx" ON "BackupEmail"("userId", "emailVerified");

-- CreateIndex
CREATE INDEX "BackupEmail_userId_idx" ON "BackupEmail"("userId");

-- CreateIndex
CREATE INDEX "PendingBackupEmailVerification_expiresAt_idx" ON "PendingBackupEmailVerification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PendingBackupEmailVerification_userId_email_key" ON "PendingBackupEmailVerification"("userId", "email");

-- AddForeignKey
ALTER TABLE "BackupEmail" ADD CONSTRAINT "BackupEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingBackupEmailVerification" ADD CONSTRAINT "PendingBackupEmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
