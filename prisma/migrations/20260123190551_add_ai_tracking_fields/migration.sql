-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "tx_ref" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "form_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_name" TEXT,
    "customer_phone" TEXT,
    "customer_email" TEXT,
    "chapa_ref" TEXT,
    "paid_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "pdf_url" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "ai_generated_at" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_tx_ref_key" ON "Order"("tx_ref");

-- CreateIndex
CREATE UNIQUE INDEX "Order_chapa_ref_key" ON "Order"("chapa_ref");
