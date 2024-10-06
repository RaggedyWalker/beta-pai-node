-- DropForeignKey
ALTER TABLE `stock_train_record` DROP FOREIGN KEY `stock_train_record_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_train_transactions` DROP FOREIGN KEY `stock_train_transactions_record_id_fkey`;
