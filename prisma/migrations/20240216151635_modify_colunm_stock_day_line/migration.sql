/*
  Warnings:

  - You are about to alter the column `amp_pct` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal(8,2)` to `Float`.
  - You are about to alter the column `growth_pct` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Decimal(8,2)` to `Float`.

*/
-- AlterTable
ALTER TABLE `stock_day_line` MODIFY `amp_pct` FLOAT NOT NULL,
    MODIFY `growth_pct` FLOAT NOT NULL;
