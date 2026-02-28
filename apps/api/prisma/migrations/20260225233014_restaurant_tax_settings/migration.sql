-- AlterTable
ALTER TABLE "restaurant" ADD COLUMN     "prices_include_vat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "service_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
ADD COLUMN     "vat_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.1300,
ALTER COLUMN "currency" SET DEFAULT 'CRC';
