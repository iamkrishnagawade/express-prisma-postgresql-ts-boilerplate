-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "fingerprint" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;
