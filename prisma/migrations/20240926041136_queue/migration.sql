/*
  Warnings:

  - A unique constraint covering the columns `[queue]` on the table `IdentityProperties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `queue` to the `IdentityProperties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `IdentityProperties` ADD COLUMN `queue` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `IdentityProperties_queue_key` ON `IdentityProperties`(`queue`);
