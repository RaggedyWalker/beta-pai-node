/*
  Warnings:

  - The primary key for the `all_stocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `stock_code` on the `all_stocks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(10)`.
  - You are about to alter the column `time` on the `stock_day_line` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `all_stocks` DROP PRIMARY KEY,
    MODIFY `stock_code` VARCHAR(10) NOT NULL,
    ADD PRIMARY KEY (`stock_code`);

-- AlterTable
ALTER TABLE `stock_day_line` MODIFY `time` TIMESTAMP NOT NULL;
