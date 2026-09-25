-- Update User table
ALTER TABLE "User" RENAME COLUMN "name" TO "firstName";
ALTER TABLE "User" ALTER COLUMN "mobile" SET NOT NULL;
ALTER TABLE "User" RENAME COLUMN "mobileVerified" TO "isPhoneVerified";
ALTER TABLE "User" RENAME COLUMN "otp" TO "phoneOtp";
ALTER TABLE "User" RENAME COLUMN "otpExpiry" TO "phoneOtpExpiry";

-- Create UserSettings table
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    "enableMatchAlerts" BOOLEAN NOT NULL DEFAULT true,
    "enableNewsAlerts" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- Create index on userId
CREATE INDEX "UserSettings_userId_idx" ON "UserSettings"("userId");

-- Create unique constraint on userId
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- Add foreign key constraint
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
