-- AlterTable
ALTER TABLE `stock_train_record` ADD COLUMN `finished` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `stock_train_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `price` FLOAT NOT NULL,
    `amount` INTEGER NOT NULL,
    `direction` SMALLINT NOT NULL,
    `record_id` INTEGER NOT NULL,

    INDEX `stock_train_transactions_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stock_train_transactions` ADD CONSTRAINT `stock_train_transactions_record_id_fkey` FOREIGN KEY (`record_id`) REFERENCES `stock_train_record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
