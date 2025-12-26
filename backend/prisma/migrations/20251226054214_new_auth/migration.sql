-- 1) Add username as nullable first
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- 2) Backfill username for existing rows
-- Use email prefix + id to avoid duplicates
UPDATE "User"
SET "username" = CONCAT(SPLIT_PART(email, '@', 1), '_', id)
WHERE "username" IS NULL;

-- 3) Make it required
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- 4) Add unique index
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
