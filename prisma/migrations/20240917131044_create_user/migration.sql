/*
  Warnings:

  - Added the required column `user_id` to the `stock_train_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_train_record` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `stock_train_record` ADD CONSTRAINT `stock_train_record_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
