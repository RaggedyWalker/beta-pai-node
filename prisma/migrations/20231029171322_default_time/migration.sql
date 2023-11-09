-- CreateTable
CREATE TABLE `stock_predict` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock_code` VARCHAR(20) NOT NULL,
    `stock_name` VARCHAR(20) NULL,
    `comment` VARCHAR(200) NULL,
    `create_time` DATETIME(0) NULL DEFAULT NOW() ON UPDATE NOW(),
    `confidence_grade` TINYINT NULL,
    `goal_price` VARCHAR(100) NULL,
    `user_name` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
