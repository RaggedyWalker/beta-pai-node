/*
  Warnings:

  - Made the column `apply_status` on table `account_application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `account_application` MODIFY `apply_status` ENUM('PENDING', 'RESOLVE', 'REJECT') NOT NULL DEFAULT 'PENDING';
