/*
  Warnings:

  - You are about to drop the column `pct_pct` on the `stock_day_line` table. All the data in the column will be lost.
  - You are about to alter the column `time` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `growth_pct` to the `stock_day_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_day_line` DROP COLUMN `pct_pct`,
    ADD COLUMN `growth_pct` DECIMAL(6, 2) NOT NULL,
    MODIFY `time` TIMESTAMP NOT NULL;
