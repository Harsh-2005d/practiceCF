/*
  Warnings:

  - The primary key for the `Contest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `handle` on the `User` table. All the data in the column will be lost.
  - Added the required column `platformId` to the `ContestProblem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_contestId_fkey";

-- DropIndex
DROP INDEX "User_handle_key";

-- AlterTable
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_pkey",
ADD CONSTRAINT "Contest_pkey" PRIMARY KEY ("id", "platformId");

-- AlterTable
ALTER TABLE "ContestProblem" ADD COLUMN     "platformId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "handle";

-- CreateTable
CREATE TABLE "UserPlatformHandle" (
    "userId" TEXT NOT NULL,
    "platformId" INTEGER NOT NULL,
    "handle" TEXT NOT NULL,

    CONSTRAINT "UserPlatformHandle_pkey" PRIMARY KEY ("userId","platformId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPlatformHandle_platformId_handle_key" ON "UserPlatformHandle"("platformId", "handle");

-- AddForeignKey
ALTER TABLE "UserPlatformHandle" ADD CONSTRAINT "UserPlatformHandle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlatformHandle" ADD CONSTRAINT "UserPlatformHandle_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contestId_platformId_fkey" FOREIGN KEY ("contestId", "platformId") REFERENCES "Contest"("id", "platformId") ON DELETE CASCADE ON UPDATE CASCADE;
