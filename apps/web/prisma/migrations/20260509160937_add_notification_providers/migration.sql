-- CreateEnum
CREATE TYPE "NotificationProviderType" AS ENUM ('DISCORD', 'SLACK', 'MICROSOFT_TEAMS', 'TELEGRAM', 'CUSTOM_WEBHOOK');

-- CreateEnum
CREATE TYPE "NotificationEventType" AS ENUM ('EMAIL_SENT', 'EMAIL_DELIVERED', 'EMAIL_BOUNCED', 'EMAIL_COMPLAINED', 'EMAIL_OPENED', 'EMAIL_CLICKED', 'CONTACT_CREATED', 'CONTACT_DELETED', 'DOMAIN_VERIFIED', 'CAMPAIGN_STARTED', 'CAMPAIGN_COMPLETED', 'ERROR_ALERT');

-- AlterTable
ALTER TABLE "ContactBook" ALTER COLUMN "emoji" SET DEFAULT '�';

-- CreateTable
CREATE TABLE "NotificationProvider" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "type" "NotificationProviderType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "eventTypes" "NotificationEventType"[] DEFAULT ARRAY[]::"NotificationEventType"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "testMessageSentAt" TIMESTAMP(3),
    "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
    "lastFailureAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "providerId" TEXT NOT NULL,
    "eventType" "NotificationEventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "responseStatus" INTEGER,
    "responseTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationProvider_teamId_isActive_idx" ON "NotificationProvider"("teamId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationProvider_teamId_type_name_key" ON "NotificationProvider"("teamId", "type", "name");

-- CreateIndex
CREATE INDEX "NotificationLog_teamId_providerId_status_idx" ON "NotificationLog"("teamId", "providerId", "status");

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "NotificationLog"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "NotificationProvider" ADD CONSTRAINT "NotificationProvider_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
