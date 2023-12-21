/*
  Warnings:

  - A unique constraint covering the columns `[dayOfWeek,workoutProgramId,workoutId]` on the table `ProgramDay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProgramDay_dayOfWeek_workoutProgramId_key";

-- AlterTable
ALTER TABLE "ProgramDay" ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "WorkoutSchedule" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "reminder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkoutSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSchedule_workoutId_scheduledAt_userId_key" ON "WorkoutSchedule"("workoutId", "scheduledAt", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramDay_dayOfWeek_workoutProgramId_workoutId_key" ON "ProgramDay"("dayOfWeek", "workoutProgramId", "workoutId");

-- AddForeignKey
ALTER TABLE "WorkoutSchedule" ADD CONSTRAINT "WorkoutSchedule_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSchedule" ADD CONSTRAINT "WorkoutSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
