/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[id_hash]` on the table `BdashQuery`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE `BdashQuery` ADD COLUMN     `id_hash` VARCHAR(191) NOT NULL DEFAULT 'dummy';

-- CreateIndex
CREATE UNIQUE INDEX `BdashQuery.id_hash_unique` ON `BdashQuery`(`id_hash`);
