/*
  Warnings:

  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `identityProperties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timeSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `appointment_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `appointment_timeSlotId_fkey`;

-- DropForeignKey
ALTER TABLE `availability` DROP FOREIGN KEY `availability_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `timeSlot` DROP FOREIGN KEY `timeSlot_availabilityId_fkey`;

-- DropTable
DROP TABLE `appointment`;

-- DropTable
DROP TABLE `availability`;

-- DropTable
DROP TABLE `doctor`;

-- DropTable
DROP TABLE `identityProperties`;

-- DropTable
DROP TABLE `timeSlot`;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `crm` VARCHAR(20) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,

    UNIQUE INDEX `Doctor_email_key`(`email`),
    UNIQUE INDEX `Doctor_crm_key`(`crm`),
    UNIQUE INDEX `Doctor_cpf_key`(`cpf`),
    INDEX `idx_doctor_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(10) NOT NULL DEFAULT 'available',
    `date` DATE NOT NULL,
    `doctorId` INTEGER NOT NULL,
    `timeSlotId` INTEGER NOT NULL,

    INDEX `idx_availability_doctor_timeslot`(`doctorId`, `timeSlotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,
    `availabilityId` INTEGER NOT NULL,

    INDEX `idx_timeslot_start_end`(`startTime`, `endTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctorId` INTEGER NOT NULL,
    `patientId` INTEGER NOT NULL,
    `timeSlotId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(20) NOT NULL,

    INDEX `idx_appointment_doctor`(`doctorId`),
    INDEX `idx_appointment_patient`(`patientId`),
    INDEX `idx_appointment_timeslot`(`timeSlotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IdentityProperties` (
    `id` CHAR(36) NOT NULL,
    `businessPartnerType` VARCHAR(10) NOT NULL,
    `clientId` VARCHAR(50) NOT NULL,
    `userPoolId` VARCHAR(50) NOT NULL,
    `queue` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `IdentityProperties_businessPartnerType_key`(`businessPartnerType`),
    UNIQUE INDEX `IdentityProperties_clientId_key`(`clientId`),
    UNIQUE INDEX `IdentityProperties_userPoolId_key`(`userPoolId`),
    UNIQUE INDEX `IdentityProperties_queue_key`(`queue`),
    INDEX `idx_identity_client_userpool`(`clientId`, `userPoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `TimeSlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `TimeSlot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
