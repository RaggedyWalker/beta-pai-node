/*
  Warnings:

  - You are about to alter the column `time` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `stock_day_line` MODIFY `time` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `all_stocks` (
    `stock_code` VARCHAR(20) NOT NULL,
    `stock_name` VARCHAR(20) NOT NULL,
    `market` VARCHAR(6) NULL,

    INDEX `all_stocks_stock_code_market_idx`(`stock_code`, `market`),
    PRIMARY KEY (`stock_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `stock_day_line_code_idx` ON `stock_day_line`(`code`);
