/*
  Warnings:

  - A unique constraint covering the columns `[aircraftId,date,offblock]` on the table `Flight` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `offblock` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "offblock" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Flight_aircraftId_date_offblock_key" ON "Flight"("aircraftId", "date", "offblock");
