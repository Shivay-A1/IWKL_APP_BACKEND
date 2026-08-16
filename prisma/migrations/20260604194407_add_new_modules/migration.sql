-- CreateTable
CREATE TABLE "Leadership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leadership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FanClubRegistration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "favoriteTeamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FanClubRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Footer" (
    "id" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "quickLinks" JSONB NOT NULL,
    "resources" JSONB NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "socialLinks" JSONB NOT NULL,
    "copyright" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteTagline" TEXT,
    "siteLogo" TEXT NOT NULL,
    "favicon" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "socialMedia" JSONB,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Leadership_isActive_idx" ON "Leadership"("isActive");

-- CreateIndex
CREATE INDEX "Leadership_order_idx" ON "Leadership"("order");

-- CreateIndex
CREATE INDEX "FanClubRegistration_favoriteTeamId_idx" ON "FanClubRegistration"("favoriteTeamId");

-- CreateIndex
CREATE INDEX "FanClubRegistration_email_idx" ON "FanClubRegistration"("email");

-- CreateIndex
CREATE INDEX "FanClubRegistration_createdAt_idx" ON "FanClubRegistration"("createdAt");

-- AddForeignKey
ALTER TABLE "FanClubRegistration" ADD CONSTRAINT "FanClubRegistration_favoriteTeamId_fkey" FOREIGN KEY ("favoriteTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
