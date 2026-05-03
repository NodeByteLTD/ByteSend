-- CreateTable
CREATE TABLE "CloudflareConnection" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CloudflareConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CloudflareConnection_teamId_key" ON "CloudflareConnection"("teamId");

-- AddForeignKey
ALTER TABLE "CloudflareConnection" ADD CONSTRAINT "CloudflareConnection_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
