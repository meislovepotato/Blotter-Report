-- DropForeignKey
ALTER TABLE `complaintevent` DROP FOREIGN KEY `ComplaintEvent_adminId_fkey`;

-- DropIndex
DROP INDEX `ComplaintEvent_adminId_fkey` ON `complaintevent`;

-- AlterTable
ALTER TABLE `complaintevent` MODIFY `adminId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ComplaintEvent` ADD CONSTRAINT `ComplaintEvent_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
