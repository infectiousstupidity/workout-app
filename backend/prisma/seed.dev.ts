import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Create roles
  const userRole = await prisma.role.create({ data: { name: 'user' } });
  const adminRole = await prisma.role.create({ data: { name: 'admin' } });

  // Create hashed password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const admin = await prisma.user.create({
    data: {
      username: 'AdminUser',
      email: 'admin@example.com',
      password: hashedPassword,
      role: { connect: { id: adminRole.id } },
      emailVerified: true,
    },
  });

  // Create users
  const user = await prisma.user.create({
    data: {
      username: 'TestUser',
      email: 'testuser@example.com',
      password: hashedPassword,
      role: { connect: { id: userRole.id } },
      emailVerified: true,
    },
  });

  // Create exercises
  const exercise1 = await prisma.exercise.create({
    data: {
      name: 'Push-ups',
      description: 'A basic push-up exercise',
      userId: user.id,
    },
  });

  // Create workouts
  const workout1 = await prisma.workout.create({
    data: {
      name: 'Morning Workout',
      user: { connect: { id: user.id } },
      exercise: { connect: { id: exercise1.id } },
    },
  });

  // Create sets
  await prisma.set.createMany({
    data: [
      {
        workoutId: workout1.id,
        exerciseId: exercise1.id,
        targetReps: 10,
        actualReps: 10,
        weight: 0,
        date: new Date(),
      },
    ],
  });

  // Create increments
  await prisma.increment.create({
    data: {
      exerciseId: exercise1.id,
      incrementValue: 2.5,
    },
  });

  // Create workout history
  await prisma.workoutHistory.create({
    data: {
      workoutId: workout1.id,
      userId: user.id,
      performedAt: new Date(),
      comments: 'Felt great!',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch((e) => {
      console.error('Error disconnecting: ', e);
    });
  });
