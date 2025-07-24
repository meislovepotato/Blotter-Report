/*
  Warnings:

  - You are about to alter the column `severity` on the `complaint` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(9))` to `Int`.

*/
-- AlterTable
ALTER TABLE `complaint` MODIFY `severity` INTEGER NULL;
