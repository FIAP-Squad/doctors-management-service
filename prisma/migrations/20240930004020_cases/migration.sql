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
ALTER TABLE `Availability` DROP FOREIGN KEY `Availability_timeSlotId_fkey`;

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
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `crm` VARCHAR(20) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `doctor_email_key`(`email`),
    UNIQUE INDEX `doctor_crm_key`(`crm`),
    UNIQUE INDEX `doctor_cpf_key`(`cpf`),
    INDEX `idx_doctor_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(10) NOT NULL DEFAULT 'available',
    `date` DATETIME(3) NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `timeSlotId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_availability_doctor_timeslot`(`doctorId`, `timeSlotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timeSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `availabilityId` INTEGER NOT NULL,

    INDEX `idx_timeslot_start_end`(`startTime`, `endTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctorId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `timeSlotId` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_appointment_doctor`(`doctorId`),
    INDEX `idx_appointment_patient`(`patientId`),
    INDEX `idx_appointment_timeslot`(`timeSlotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identityProperties` (
    `id` CHAR(36) NOT NULL,
    `businessPartnerType` VARCHAR(10) NOT NULL,
    `clientId` VARCHAR(50) NOT NULL,
    `userPoolId` VARCHAR(50) NOT NULL,
    `queue` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `identityProperties_businessPartnerType_key`(`businessPartnerType`),
    UNIQUE INDEX `identityProperties_clientId_key`(`clientId`),
    UNIQUE INDEX `identityProperties_userPoolId_key`(`userPoolId`),
    UNIQUE INDEX `identityProperties_queue_key`(`queue`),
    INDEX `idx_identity_client_userpool`(`clientId`, `userPoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability` ADD CONSTRAINT `availability_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `timeSlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `timeSlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
