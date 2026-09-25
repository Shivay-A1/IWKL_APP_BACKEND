-- Update old banners to use backend image endpoint
-- This script updates imageUrl for banners that have file paths to use the backend image endpoint

UPDATE "HomepageBanner"
SET "imageUrl" = 'https://iwklappbackend-production.up.railway.app/api/homepage-banners/' || id || '/image'
WHERE "imageUrl" LIKE '/app/uploads/%'
   OR "imageUrl" IS NULL;
