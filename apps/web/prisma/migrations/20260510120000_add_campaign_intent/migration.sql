-- Add campaign intent to support separate Broadcast and Campaign views on shared data model
CREATE TYPE "CampaignIntent" AS ENUM ('CAMPAIGN', 'BROADCAST');

ALTER TABLE "Campaign"
ADD COLUMN "intent" "CampaignIntent" NOT NULL DEFAULT 'CAMPAIGN';

CREATE INDEX "Campaign_intent_createdAt_idx" ON "Campaign"("intent", "createdAt" DESC);
