-- Alter SocialMediaPartnerRegistration table to change numeric fields to BigInt
-- This migration should be run when the database is accessible

-- Alter instagramFollowers from Int to BigInt
ALTER TABLE "SocialMediaPartnerRegistration" ALTER COLUMN "instagramFollowers" TYPE BIGINT;

-- Alter youtubeSubscribers from Int to BigInt
ALTER TABLE "SocialMediaPartnerRegistration" ALTER COLUMN "youtubeSubscribers" TYPE BIGINT;

-- Alter facebookFollowers from Int to BigInt
ALTER TABLE "SocialMediaPartnerRegistration" ALTER COLUMN "facebookFollowers" TYPE BIGINT;

-- Alter twitterFollowers from Int to BigInt
ALTER TABLE "SocialMediaPartnerRegistration" ALTER COLUMN "twitterFollowers" TYPE BIGINT;

-- Alter averageMonthlyReach from Int to BigInt
ALTER TABLE "SocialMediaPartnerRegistration" ALTER COLUMN "averageMonthlyReach" TYPE BIGINT;
