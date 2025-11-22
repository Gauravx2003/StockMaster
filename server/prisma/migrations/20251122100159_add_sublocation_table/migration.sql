/*
  Warnings:

  - You are about to drop the column `warehouseId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the `ReorderRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResetToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[warehouseId,productId,subLocationId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortcode]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortcode` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "ReorderRule" DROP CONSTRAINT "ReorderRule_productId_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_locationId_fkey";

-- DropIndex
DROP INDEX "Stock_warehouseId_locationId_productId_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "warehouseId";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "locationId",
ADD COLUMN     "subLocationId" TEXT;

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "location",
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "shortcode" TEXT NOT NULL;

-- DropTable
DROP TABLE "ReorderRule";

-- DropTable
DROP TABLE "ResetToken";

-- CreateTable
CREATE TABLE "SubLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "SubLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_warehouseId_productId_subLocationId_key" ON "Stock"("warehouseId", "productId", "subLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_shortcode_key" ON "Warehouse"("shortcode");

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubLocation" ADD CONSTRAINT "SubLocation_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_subLocationId_fkey" FOREIGN KEY ("subLocationId") REFERENCES "SubLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
