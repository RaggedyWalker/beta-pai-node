-- CreateTable
CREATE TABLE `stock_predict` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock_code` VARCHAR(20) NOT NULL,
    `stock_name` VARCHAR(20) NULL,
    `comment` VARCHAR(200) NULL,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `confidence_grade` TINYINT NULL,
    `predict_trend` TINYINT NULL,
    `goal_price` VARCHAR(100) NULL,
    `user_name` VARCHAR(20) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
