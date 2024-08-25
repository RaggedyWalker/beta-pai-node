/*
  Warnings:

  - You are about to alter the column `amp_pct` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `Decimal(8,2)`.
  - You are about to alter the column `growth_pct` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE `stock_day_line` MODIFY `amp_pct` DECIMAL(8, 2) NOT NULL,
    MODIFY `growth_pct` DECIMAL(8, 2) NOT NULL;
