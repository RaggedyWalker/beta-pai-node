-- AlterTable
ALTER TABLE `account_application` ADD COLUMN `apply_status` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `create_date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stock_predict` MODIFY `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
