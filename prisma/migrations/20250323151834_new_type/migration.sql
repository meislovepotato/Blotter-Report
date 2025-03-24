/*
  Warnings:

  - Made the column `attachmentFront` on table `blotter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `attachmentBack` on table `blotter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `blotter` MODIFY `attachmentFront` LONGBLOB NOT NULL,
    MODIFY `attachmentBack` LONGBLOB NOT NULL;
