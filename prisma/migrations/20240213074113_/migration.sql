/*
  Warnings:

  - Made the column `goal_price` on table `stock_predict` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `stock_predict` MODIFY `goal_price` DECIMAL(8, 2) NOT NULL;
