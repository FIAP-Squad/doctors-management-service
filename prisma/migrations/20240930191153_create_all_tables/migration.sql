-- CreateTable
CREATE TABLE `doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `crm` VARCHAR(20) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `doctor_email_key`(`email`),
    UNIQUE INDEX `doctor_crm_key`(`crm`),
    UNIQUE INDEX `doctor_cpf_key`(`cpf`),
    INDEX `idx_doctor_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `patient_email_key`(`email`),
    UNIQUE INDEX `patient_cpf_key`(`cpf`),
    INDEX `idx_doctor_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(10) NOT NULL DEFAULT 'available',
    `date` VARCHAR(191) NOT NULL,
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
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,

    INDEX `idx_timeslot_start_end`(`startTime`, `endTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `availabilityId` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `appointment_availabilityId_key`(`availabilityId`),
    INDEX `idx_appointment_patient`(`patientId`),
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
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_availabilityId_fkey` FOREIGN KEY (`availabilityId`) REFERENCES `availability`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
