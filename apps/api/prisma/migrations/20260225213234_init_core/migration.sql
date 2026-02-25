-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'DISABLED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TabStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('POS', 'TABLET', 'WAITER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_KITCHEN', 'READY', 'SERVED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'VOIDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AdjustmentScope" AS ENUM ('SESSION', 'TAB');

-- CreateEnum
CREATE TYPE "AdjustmentType" AS ENUM ('DISCOUNT', 'SURCHARGE');

-- CreateEnum
CREATE TYPE "AdjustmentMode" AS ENUM ('PERCENT', 'FIXED');

-- CreateTable
CREATE TABLE "restaurant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "timezone" TEXT NOT NULL DEFAULT 'America/Costa_Rica',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dining_table" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dining_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dining_table_qr" (
    "id" UUID NOT NULL,
    "table_id" UUID NOT NULL,
    "public_code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dining_table_qr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_session" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "table_id" UUID NOT NULL,
    "public_code" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'OPEN',
    "guests_count" INTEGER,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "table_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_session_tab" (
    "id" UUID NOT NULL,
    "table_session_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "status" "TabStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "table_session_tab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "table_session_id" UUID NOT NULL,
    "source" "OrderSource" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID,
    "name_snapshot" TEXT NOT NULL,
    "qty" DECIMAL(10,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_modifier" (
    "id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "name_snapshot" TEXT NOT NULL,
    "price_delta" DECIMAL(12,2) NOT NULL,
    "qty" DECIMAL(10,3) NOT NULL DEFAULT 1,

    CONSTRAINT "order_item_modifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_allocation" (
    "id" UUID NOT NULL,
    "order_item_id" UUID NOT NULL,
    "tab_id" UUID NOT NULL,
    "qty" DECIMAL(10,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL,
    "table_session_id" UUID NOT NULL,
    "tab_id" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "provider_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_adjustment" (
    "id" UUID NOT NULL,
    "table_session_id" UUID NOT NULL,
    "tab_id" UUID,
    "scope" "AdjustmentScope" NOT NULL,
    "type" "AdjustmentType" NOT NULL,
    "mode" "AdjustmentMode" NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_adjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dining_table_restaurant_id_idx" ON "dining_table"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "dining_table_restaurant_id_name_key" ON "dining_table"("restaurant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "dining_table_qr_public_code_key" ON "dining_table_qr"("public_code");

-- CreateIndex
CREATE INDEX "dining_table_qr_table_id_idx" ON "dining_table_qr"("table_id");

-- CreateIndex
CREATE UNIQUE INDEX "table_session_public_code_key" ON "table_session"("public_code");

-- CreateIndex
CREATE INDEX "table_session_restaurant_id_idx" ON "table_session"("restaurant_id");

-- CreateIndex
CREATE INDEX "table_session_table_id_status_idx" ON "table_session"("table_id", "status");

-- CreateIndex
CREATE INDEX "table_session_tab_table_session_id_idx" ON "table_session_tab"("table_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "table_session_tab_table_session_id_label_key" ON "table_session_tab"("table_session_id", "label");

-- CreateIndex
CREATE INDEX "order_table_session_id_idx" ON "order"("table_session_id");

-- CreateIndex
CREATE INDEX "order_restaurant_id_idx" ON "order"("restaurant_id");

-- CreateIndex
CREATE INDEX "order_item_order_id_idx" ON "order_item"("order_id");

-- CreateIndex
CREATE INDEX "order_item_modifier_order_item_id_idx" ON "order_item_modifier"("order_item_id");

-- CreateIndex
CREATE INDEX "order_item_allocation_tab_id_idx" ON "order_item_allocation"("tab_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_allocation_order_item_id_tab_id_key" ON "order_item_allocation"("order_item_id", "tab_id");

-- CreateIndex
CREATE INDEX "payment_table_session_id_idx" ON "payment"("table_session_id");

-- CreateIndex
CREATE INDEX "payment_tab_id_idx" ON "payment"("tab_id");

-- CreateIndex
CREATE INDEX "session_adjustment_table_session_id_idx" ON "session_adjustment"("table_session_id");

-- CreateIndex
CREATE INDEX "session_adjustment_tab_id_idx" ON "session_adjustment"("tab_id");

-- AddForeignKey
ALTER TABLE "dining_table" ADD CONSTRAINT "dining_table_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dining_table_qr" ADD CONSTRAINT "dining_table_qr_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "dining_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_session" ADD CONSTRAINT "table_session_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_session" ADD CONSTRAINT "table_session_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "dining_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_session_tab" ADD CONSTRAINT "table_session_tab_table_session_id_fkey" FOREIGN KEY ("table_session_id") REFERENCES "table_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_table_session_id_fkey" FOREIGN KEY ("table_session_id") REFERENCES "table_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_modifier" ADD CONSTRAINT "order_item_modifier_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_allocation" ADD CONSTRAINT "order_item_allocation_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_allocation" ADD CONSTRAINT "order_item_allocation_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "table_session_tab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_table_session_id_fkey" FOREIGN KEY ("table_session_id") REFERENCES "table_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "table_session_tab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_adjustment" ADD CONSTRAINT "session_adjustment_table_session_id_fkey" FOREIGN KEY ("table_session_id") REFERENCES "table_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_adjustment" ADD CONSTRAINT "session_adjustment_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "table_session_tab"("id") ON DELETE SET NULL ON UPDATE CASCADE;
