-- DropForeignKey
ALTER TABLE `BdashQuery` DROP FOREIGN KEY `BdashQuery_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Token` DROP FOREIGN KEY `Token_ibfk_1`;

-- CreateTable
CREATE TABLE `ServiceKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `ServiceKey_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BdashQuery` ADD CONSTRAINT `BdashQuery_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_bdashQueryId_fkey` FOREIGN KEY (`bdashQueryId`) REFERENCES `BdashQuery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `BdashQuery` RENAME INDEX `BdashQuery.id_hash_unique` TO `BdashQuery_id_hash_key`;

-- RenameIndex
ALTER TABLE `Favorite` RENAME INDEX `Favorite.bdashQueryId_userId_unique` TO `Favorite_bdashQueryId_userId_key`;

-- RenameIndex
ALTER TABLE `Session` RENAME INDEX `Session.handle_unique` TO `Session_handle_key`;

-- RenameIndex
ALTER TABLE `Token` RENAME INDEX `Token.hashedToken_type_unique` TO `Token_hashedToken_type_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.accessToken_unique` TO `User_accessToken_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.email_unique` TO `User_email_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.name_unique` TO `User_name_key`;
