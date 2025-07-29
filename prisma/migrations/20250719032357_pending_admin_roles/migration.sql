/*
  Warnings:

  - Added the required column `dashboardRole` to the `PendingAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hierarchyRole` to the `PendingAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ALTER COLUMN `dashboardRole` DROP DEFAULT,
    ALTER COLUMN `hierarchyRole` DROP DEFAULT;

-- AlterTable
ALTER TABLE `pendingadmin` ADD COLUMN `dashboardRole` ENUM('ADMIN', 'STAFF') NOT NULL,
    ADD COLUMN `hierarchyRole` ENUM('CAPTAIN', 'KAGAWAD', 'SK_CHAIR', 'SECRETARY', 'CLERK', 'TANOD') NOT NULL;
