-- CreateTable
CREATE TABLE `account_application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(10) NOT NULL,
    `origin` VARCHAR(32) NOT NULL,
    `email` VARCHAR(32) NULL,
    `phone` VARCHAR(16) NULL,
    `reason` VARCHAR(20) NULL,
    `invite_key` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
