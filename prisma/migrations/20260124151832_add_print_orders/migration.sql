-- CreateEnum
CREATE TYPE "PrintOrderStatus" AS ENUM ('pending', 'contacted', 'completed');

-- CreateTable
CREATE TABLE "print_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(65,30) NOT NULL,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "print_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "print_orders" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "location" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "PrintOrderStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "print_orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "print_orders" ADD CONSTRAINT "print_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "print_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
