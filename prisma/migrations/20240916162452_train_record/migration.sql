-- CreateTable
CREATE TABLE `stock_train_record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(10) NOT NULL,
    `start_date` DATE NOT NULL,
    `period` SMALLINT NOT NULL,
    `blind` BOOLEAN NOT NULL DEFAULT false,

    INDEX `stock_train_record_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(10) NOT NULL,
    `password` VARCHAR(32) NOT NULL,
    `email` VARCHAR(32) NULL,
    `phone` VARCHAR(16) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
