/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IdentityProperties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_timeSlotId_fkey`;

-- DropForeignKey
ALTER TABLE `Availability` DROP FOREIGN KEY `Availability_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeSlot` DROP FOREIGN KEY `TimeSlot_availabilityId_fkey`;

-- DropTable
DROP TABLE `Appointment`;

-- DropTable
DROP TABLE `Availability`;

-- DropTable
DROP TABLE `Doctor`;

-- DropTable
DROP TABLE `IdentityProperties`;

-- DropTable
DROP TABLE `TimeSlot`;

-- CreateTable
CREATE TABLE `doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `crm` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `doctor_email_key`(`email`),
    UNIQUE INDEX `doctor_crm_key`(`crm`),
    UNIQUE INDEX `doctor_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `doctorId` INTEGER NOT NULL,

    INDEX `availability_doctorId_idx`(`doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timeSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `availabilityId` INTEGER NOT NULL,

    INDEX `timeSlot_availabilityId_idx`(`availabilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctorId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `timeSlotId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',

    INDEX `appointment_doctorId_idx`(`doctorId`),
    INDEX `appointment_patientId_idx`(`patientId`),
    INDEX `appointment_timeSlotId_idx`(`timeSlotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identityProperties` (
    `id` VARCHAR(191) NOT NULL,
    `businessPartnerType` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `userPoolId` VARCHAR(191) NOT NULL,
    `queue` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `identityProperties_businessPartnerType_key`(`businessPartnerType`),
    UNIQUE INDEX `identityProperties_clientId_key`(`clientId`),
    UNIQUE INDEX `identityProperties_userPoolId_key`(`userPoolId`),
    UNIQUE INDEX `identityProperties_queue_key`(`queue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeSlot` ADD CONSTRAINT `timeSlot_availabilityId_fkey` FOREIGN KEY (`availabilityId`) REFERENCES `availability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `timeSlot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
