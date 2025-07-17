/*
  Warnings:

  - You are about to drop the `incidentattachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `incidentattachment` DROP FOREIGN KEY `IncidentAttachment_blotterId_fkey`;

-- DropTable
DROP TABLE `incidentattachment`;

-- CreateTable
CREATE TABLE `BlotterAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `file` LONGBLOB NOT NULL,
    `blotterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlotterAttachment` ADD CONSTRAINT `BlotterAttachment_blotterId_fkey` FOREIGN KEY (`blotterId`) REFERENCES `Blotter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
