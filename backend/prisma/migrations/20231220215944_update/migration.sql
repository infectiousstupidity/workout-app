/*
  Warnings:

  - You are about to drop the column `description` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `workoutId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `skipNextIncrement` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `Increment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workoutId,performedAt,userId]` on the table `WorkoutHistory` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `workoutHistoryId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "incrementValue" DOUBLE PRECISION NOT NULL DEFAULT 2.5;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN "new_name" "RoleName" NOT NULL DEFAULT 'USER';
UPDATE "Role" SET "new_name" = 'USER' WHERE "name" = 'user';
UPDATE "Role" SET "new_name" = 'ADMIN' WHERE "name" = 'admin';

-- AlterTable
ALTER TABLE "Set" ADD COLUMN "workoutHistoryId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "new_username" TEXT;
UPDATE "User" SET "new_username" = "username";

-- AlterTable
ALTER TABLE "WorkoutHistory" ADD COLUMN "new_workoutId" INTEGER;
UPDATE "WorkoutHistory" SET "new_workoutId" = "workoutId";

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "workoutId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "skipIncrement" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("workoutId","exerciseId")
);

-- CreateTable
CREATE TABLE "Rep" (
    "id" SERIAL NOT NULL,
    "workoutExerciseWorkoutId" INTEGER NOT NULL,
    "workoutExerciseExerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "targetReps" INTEGER NOT NULL,
    "actualReps" INTEGER NOT NULL,

    CONSTRAINT "Rep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutProgram" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramDay" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "workoutId" INTEGER,
    "workoutProgramId" INTEGER NOT NULL,

    CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rep_setNumber_workoutExerciseWorkoutId_workoutExerciseExerc_key" ON "Rep"("setNumber", "workoutExerciseWorkoutId", "workoutExerciseExerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramDay_dayOfWeek_workoutProgramId_key" ON "ProgramDay"("dayOfWeek", "workoutProgramId");

-- CreateIndex
CREATE INDEX "Set_workoutHistoryId_exerciseId_idx" ON "Set"("workoutHistoryId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_new_username_key" ON "User"("new_username");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutHistory_new_workoutId_performedAt_userId_key" ON "WorkoutHistory"("new_workoutId", "performedAt", "userId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutHistoryId_fkey" FOREIGN KEY ("workoutHistoryId") REFERENCES "WorkoutHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rep" ADD CONSTRAINT "Rep_workoutExerciseWorkoutId_workoutExerciseExerciseId_fkey" FOREIGN KEY ("workoutExerciseWorkoutId", "workoutExerciseExerciseId") REFERENCES "WorkoutExercise"("workoutId", "exerciseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutProgram" ADD CONSTRAINT "WorkoutProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "WorkoutProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;