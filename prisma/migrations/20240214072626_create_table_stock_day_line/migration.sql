-- CreateTable
CREATE TABLE `stock_day_line` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(10) NOT NULL,
    `high` DECIMAL(8, 2) NOT NULL,
    `low` DECIMAL(8, 2) NOT NULL,
    `open` DECIMAL(8, 2) NOT NULL,
    `close` DECIMAL(8, 2) NOT NULL,
    `volume` BIGINT NOT NULL,
    `amount` BIGINT NOT NULL,
    `time` TIMESTAMP NOT NULL,
    `unit` VARCHAR(4) NOT NULL DEFAULT '元',
    `pct_pct` DECIMAL(6, 2) NOT NULL,
    `amp_pct` DECIMAL(6, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
