/*
  Warnings:

  - You are about to drop the column `cuisines` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_vendorId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryPersonId" INTEGER,
ADD COLUMN     "deliveryStatus" TEXT DEFAULT 'Pending',
ADD COLUMN     "deliveryTime" TIMESTAMP(3),
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "cuisines",
DROP COLUMN "rating",
DROP COLUMN "vendorId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "checkoutTime" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ownerId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
