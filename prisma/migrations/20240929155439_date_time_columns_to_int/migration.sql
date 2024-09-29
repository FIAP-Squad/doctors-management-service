/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `date` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startTime` on the `TimeSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `TimeSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Availability` DROP COLUMN `dayOfWeek`,
    ADD COLUMN `date` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `TimeSlot` DROP COLUMN `startTime`,
    ADD COLUMN `startTime` INTEGER NOT NULL,
    DROP COLUMN `endTime`,
    ADD COLUMN `endTime` INTEGER NOT NULL;
