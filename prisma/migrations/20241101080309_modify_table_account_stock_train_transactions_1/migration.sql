/*
  Warnings:

  - You are about to drop the column `ending_growth_pct` on the `stock_train_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `stock_train_record` ADD COLUMN `ending_growth_pct` FLOAT NULL;

-- AlterTable
ALTER TABLE `stock_train_transactions` DROP COLUMN `ending_growth_pct`;
