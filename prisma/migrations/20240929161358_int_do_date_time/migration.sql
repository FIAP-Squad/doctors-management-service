/*
  Warnings:

  - Changed the type of `date` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `TimeSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `TimeSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Availability` DROP COLUMN `date`,
    ADD COLUMN `date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `TimeSlot` DROP COLUMN `startTime`,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL,
    DROP COLUMN `endTime`,
    ADD COLUMN `endTime` DATETIME(3) NOT NULL;
