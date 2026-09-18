/*
  Warnings:

  - You are about to drop the column `durationMins` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `instructorId` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `pilotId` on the `Flight` table. All the data in the column will be lost.
  - Added the required column `departure` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landing` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfLandings` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `onblock` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picId` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `takeoff` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_pilotId_fkey";

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "durationMins",
DROP COLUMN "instructorId",
DROP COLUMN "pilotId",
ADD COLUMN     "coPilotId" TEXT,
ADD COLUMN     "departure" TEXT NOT NULL,
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "landing" TEXT NOT NULL,
ADD COLUMN     "numberOfLandings" INTEGER NOT NULL,
ADD COLUMN     "onblock" TEXT NOT NULL,
ADD COLUMN     "picId" TEXT NOT NULL,
ADD COLUMN     "takeoff" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_picId_fkey" FOREIGN KEY ("picId") REFERENCES "Pilot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_coPilotId_fkey" FOREIGN KEY ("coPilotId") REFERENCES "Pilot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
