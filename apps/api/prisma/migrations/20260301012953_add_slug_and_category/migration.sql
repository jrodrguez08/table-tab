/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "category_id" UUID,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "restaurant" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "category_restaurant_id_sort_order_idx" ON "category"("restaurant_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "category_restaurant_id_name_key" ON "category"("restaurant_id", "name");

-- CreateIndex
CREATE INDEX "product_restaurant_id_category_id_sort_order_idx" ON "product"("restaurant_id", "category_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_slug_key" ON "restaurant"("slug");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
