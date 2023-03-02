/*
  Warnings:

  - You are about to drop the column `target_name` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "target_name",
DROP COLUMN "to",
DROP COLUMN "user_id",
DROP COLUMN "username",
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "name" TEXT;
