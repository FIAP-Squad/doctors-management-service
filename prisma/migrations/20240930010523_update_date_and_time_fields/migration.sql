/*
  Warnings:

  - You are about to drop the column `updated` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `availability` MODIFY `date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `updated`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `timeSlot` MODIFY `startTime` TIME NOT NULL,
    MODIFY `endTime` TIME NOT NULL;
