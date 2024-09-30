-- AlterTable
ALTER TABLE `availability` MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `timeSlot` MODIFY `startTime` VARCHAR(191) NOT NULL,
    MODIFY `endTime` VARCHAR(191) NOT NULL;
