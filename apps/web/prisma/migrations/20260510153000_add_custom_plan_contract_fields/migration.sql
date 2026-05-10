-- Add custom plan contract fields for slider-based plans
ALTER TABLE "Team"
ADD COLUMN "customPlanEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "customMarketingEmailLimit" INTEGER,
ADD COLUMN "customTransactionalEmailLimit" INTEGER,
ADD COLUMN "customMonthlyPriceCents" INTEGER;
