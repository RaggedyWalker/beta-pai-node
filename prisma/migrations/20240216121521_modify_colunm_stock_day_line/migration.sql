/*
  Warnings:

  - You are about to alter the column `time` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Changed the type of `amount` on the `stock_day_line` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `stock_day_line` DROP COLUMN `amount`,
    ADD COLUMN `amount` DECIMAL(16, 2) NOT NULL,
    MODIFY `time` TIMESTAMP NOT NULL;
