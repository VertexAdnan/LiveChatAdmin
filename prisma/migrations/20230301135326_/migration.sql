/*
  Warnings:

  - The `customer_id` column on the `Messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "customer_id",
ADD COLUMN     "customer_id" INTEGER;
