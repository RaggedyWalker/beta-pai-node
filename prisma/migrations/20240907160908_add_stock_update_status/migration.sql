-- CreateTable
CREATE TABLE `stock_update_status` (
    `code` VARCHAR(10) NOT NULL,
    `update_time` DATE NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
