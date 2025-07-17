-- CreateTable
CREATE TABLE `Barangay` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Barangay 123',
    `logoUrl` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL DEFAULT 'Zone 10, District 1, Manila City',
    `hotline` VARCHAR(191) NOT NULL DEFAULT '(02) 8765 4321',
    `email` VARCHAR(191) NOT NULL DEFAULT 'barangay123@tondo.gov.ph',
    `officeHours` VARCHAR(191) NOT NULL DEFAULT 'Monday–Friday, 8:00 AM to 5:00 PM',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dashboardRole` ENUM('ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    `hierarchyRole` ENUM('CAPTAIN', 'KAGAWAD', 'SK_CHAIR', 'SECRETARY', 'CLERK') NOT NULL DEFAULT 'CLERK',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Complainant` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `fullAddress` VARCHAR(191) NOT NULL,
    `otherContacts` VARCHAR(191) NULL,
    `residencyProof` ENUM('ID', 'UTILITY_BILL') NOT NULL,
    `attachmentIDFront` LONGBLOB NULL,
    `attachmentIDBack` LONGBLOB NULL,
    `attachmentUtility` LONGBLOB NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Complainant_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Complaint` (
    `id` VARCHAR(191) NOT NULL,
    `trackingId` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('NOISE_COMPLAINT', 'THEFT_OR_BURGLARY', 'TRESPASSING', 'DISTURBANCE_OF_PEACE', 'ASSAULT', 'TRAFFIC_INCIDENT', 'DISORDERLY_CONDUCT', 'PROPERTY_DAMAGE', 'SUSPICIOUS_ACTIVITY', 'DOMESTIC_VIOLENCE') NOT NULL,
    `incidentDateTime` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `subjectName` VARCHAR(191) NULL,
    `subjectContext` TEXT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'ESCALATION_REQUESTED', 'ESCALATED', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `remarks` TEXT NULL,
    `complainantId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `escalatedAt` DATETIME(3) NULL,
    `deniedAt` DATETIME(3) NULL,
    `reviewedByAdminId` VARCHAR(191) NULL,
    `blotterId` VARCHAR(191) NULL,

    UNIQUE INDEX `Complaint_trackingId_key`(`trackingId`),
    UNIQUE INDEX `Complaint_blotterId_key`(`blotterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComplaintAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `file` LONGBLOB NOT NULL,
    `complaintId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blotter` (
    `id` VARCHAR(191) NOT NULL,
    `trackingId` VARCHAR(191) NOT NULL,
    `status` ENUM('FILED', 'UNDER_MEDIATION', 'RESOLVED', 'REFERRED') NOT NULL DEFAULT 'FILED',
    `remarks` TEXT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('NOISE_COMPLAINT', 'THEFT_OR_BURGLARY', 'TRESPASSING', 'DISTURBANCE_OF_PEACE', 'ASSAULT', 'TRAFFIC_INCIDENT', 'DISORDERLY_CONDUCT', 'PROPERTY_DAMAGE', 'SUSPICIOUS_ACTIVITY', 'DOMESTIC_VIOLENCE') NOT NULL,
    `incidentDateTime` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `subjectName` VARCHAR(191) NULL,
    `subjectContext` TEXT NULL,
    `complainantId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resolvedAt` DATETIME(3) NULL,
    `updatedByAdminId` VARCHAR(191) NULL,

    UNIQUE INDEX `Blotter_trackingId_key`(`trackingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncidentAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `file` LONGBLOB NOT NULL,
    `blotterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PendingAdmin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PendingAdmin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_complainantId_fkey` FOREIGN KEY (`complainantId`) REFERENCES `Complainant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_reviewedByAdminId_fkey` FOREIGN KEY (`reviewedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_blotterId_fkey` FOREIGN KEY (`blotterId`) REFERENCES `Blotter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComplaintAttachment` ADD CONSTRAINT `ComplaintAttachment_complaintId_fkey` FOREIGN KEY (`complaintId`) REFERENCES `Complaint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blotter` ADD CONSTRAINT `Blotter_complainantId_fkey` FOREIGN KEY (`complainantId`) REFERENCES `Complainant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blotter` ADD CONSTRAINT `Blotter_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncidentAttachment` ADD CONSTRAINT `IncidentAttachment_blotterId_fkey` FOREIGN KEY (`blotterId`) REFERENCES `Blotter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
