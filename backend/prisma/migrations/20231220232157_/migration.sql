/*
  Warnings:

  - You are about to drop the column `description` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `new_name` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `workoutId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `new_username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `skipNextIncrement` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `new_workoutId` on the `WorkoutHistory` table. All the data in the column will be lost.
  - You are about to drop the `Increment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workoutId,performedAt,userId]` on the table `WorkoutHistory` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `workoutHistoryId` on table `Set` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Increment" DROP CONSTRAINT "Increment_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_exerciseId_fkey";

-- DropIndex
DROP INDEX "Role_name_key";

-- DropIndex
DROP INDEX "User_new_username_key";

-- DropIndex
DROP INDEX "WorkoutHistory_new_workoutId_performedAt_userId_key";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "new_name",
DROP COLUMN "name",
ADD COLUMN     "name" "RoleName" NOT NULL;

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "workoutId",
ALTER COLUMN "workoutHistoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "new_username",
DROP COLUMN "roleId";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "exerciseId",
DROP COLUMN "skipNextIncrement";

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "incrementValue" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
ADD COLUMN     "initialWeight" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkoutHistory" DROP COLUMN "new_workoutId";

-- DropTable
DROP TABLE "Increment";

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "defaultIncrementValue" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "measurementUnit" TEXT NOT NULL DEFAULT 'kg',
    "reminders" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalBest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalBest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutProgramExerciseProgress" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "currentWeight" DOUBLE PRECISION NOT NULL,
    "incrementValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WorkoutProgramExerciseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalExerciseProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "lastWeight" DOUBLE PRECISION NOT NULL,
    "nextWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GlobalExerciseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalBest_userId_exerciseId_key" ON "PersonalBest"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutProgramExerciseProgress_programId_exerciseId_key" ON "WorkoutProgramExerciseProgress"("programId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalExerciseProgress_userId_exerciseId_key" ON "GlobalExerciseProgress"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutHistory_workoutId_performedAt_userId_key" ON "WorkoutHistory"("workoutId", "performedAt", "userId");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalBest" ADD CONSTRAINT "PersonalBest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalBest" ADD CONSTRAINT "PersonalBest_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutProgramExerciseProgress" ADD CONSTRAINT "WorkoutProgramExerciseProgress_programId_fkey" FOREIGN KEY ("programId") REFERENCES "WorkoutProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutProgramExerciseProgress" ADD CONSTRAINT "WorkoutProgramExerciseProgress_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalExerciseProgress" ADD CONSTRAINT "GlobalExerciseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalExerciseProgress" ADD CONSTRAINT "GlobalExerciseProgress_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
