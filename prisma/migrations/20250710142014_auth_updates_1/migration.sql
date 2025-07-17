/*
  Warnings:

  - You are about to drop the column `address` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `pendingadmin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `PendingAdmin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `PendingAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `address`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `pendingadmin` DROP COLUMN `address`,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_phoneNumber_key` ON `Admin`(`phoneNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `PendingAdmin_phoneNumber_key` ON `PendingAdmin`(`phoneNumber`);
