-- CreateTable
CREATE TABLE `IdentityProperties` (
    `id` VARCHAR(191) NOT NULL,
    `businessPartnerType` VARCHAR(191) NOT NULL,
    `userPoolId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IdentityProperties_businessPartnerType_key`(`businessPartnerType`),
    UNIQUE INDEX `IdentityProperties_userPoolId_key`(`userPoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
