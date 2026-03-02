-- CreateEnum
CREATE TYPE "ModifierGroupSelectMode" AS ENUM ('OPTIONAL', 'REQUIRED');

-- CreateTable
CREATE TABLE "modifier" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price_delta" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cost_delta" DECIMAL(12,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_group" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "min_select" INTEGER NOT NULL DEFAULT 0,
    "max_select" INTEGER NOT NULL DEFAULT 99,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifier_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modifier_group_item" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "modifier_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "modifier_group_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_modifier_group" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_modifier_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_modifier_default" (
    "id" UUID NOT NULL,
    "product_modifier_group_id" UUID NOT NULL,
    "modifier_id" UUID NOT NULL,
    "qty" DECIMAL(10,3) NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_modifier_default_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_modifier" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "modifier_id" UUID NOT NULL,
    "price_delta_override" DECIMAL(12,2),
    "cost_delta_override" DECIMAL(12,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_modifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "modifier_restaurant_id_is_active_idx" ON "modifier"("restaurant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_restaurant_id_name_key" ON "modifier"("restaurant_id", "name");

-- CreateIndex
CREATE INDEX "modifier_group_restaurant_id_sort_order_idx" ON "modifier_group"("restaurant_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_group_restaurant_id_name_key" ON "modifier_group"("restaurant_id", "name");

-- CreateIndex
CREATE INDEX "modifier_group_item_group_id_sort_order_idx" ON "modifier_group_item"("group_id", "sort_order");

-- CreateIndex
CREATE INDEX "modifier_group_item_modifier_id_idx" ON "modifier_group_item"("modifier_id");

-- CreateIndex
CREATE UNIQUE INDEX "modifier_group_item_group_id_modifier_id_key" ON "modifier_group_item"("group_id", "modifier_id");

-- CreateIndex
CREATE INDEX "product_modifier_group_product_id_sort_order_idx" ON "product_modifier_group"("product_id", "sort_order");

-- CreateIndex
CREATE INDEX "product_modifier_group_group_id_idx" ON "product_modifier_group"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_modifier_group_product_id_group_id_key" ON "product_modifier_group"("product_id", "group_id");

-- CreateIndex
CREATE INDEX "product_modifier_default_modifier_id_idx" ON "product_modifier_default"("modifier_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_modifier_default_product_modifier_group_id_modifier_key" ON "product_modifier_default"("product_modifier_group_id", "modifier_id");

-- CreateIndex
CREATE INDEX "product_modifier_product_id_idx" ON "product_modifier"("product_id");

-- CreateIndex
CREATE INDEX "product_modifier_modifier_id_idx" ON "product_modifier"("modifier_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_modifier_product_id_modifier_id_key" ON "product_modifier"("product_id", "modifier_id");

-- AddForeignKey
ALTER TABLE "modifier" ADD CONSTRAINT "modifier_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_group" ADD CONSTRAINT "modifier_group_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_group_item" ADD CONSTRAINT "modifier_group_item_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "modifier_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modifier_group_item" ADD CONSTRAINT "modifier_group_item_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_group" ADD CONSTRAINT "product_modifier_group_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_group" ADD CONSTRAINT "product_modifier_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "modifier_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_default" ADD CONSTRAINT "product_modifier_default_product_modifier_group_id_fkey" FOREIGN KEY ("product_modifier_group_id") REFERENCES "product_modifier_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier_default" ADD CONSTRAINT "product_modifier_default_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier" ADD CONSTRAINT "product_modifier_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_modifier" ADD CONSTRAINT "product_modifier_modifier_id_fkey" FOREIGN KEY ("modifier_id") REFERENCES "modifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
