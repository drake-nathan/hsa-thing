/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'expense');

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "HsaTransaction" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "type" "TransactionType" NOT NULL,
    "withdrawn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HsaTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HsaTransaction_type_idx" ON "HsaTransaction"("type");

-- CreateIndex
CREATE INDEX "HsaTransaction_date_idx" ON "HsaTransaction"("date");
