import { Router } from 'express';
import { authenticateJwt } from '../../middleware/jwt-auth-middleware';
import { asyncHandler } from '../../utilities/errors/async-handler';
import {
  createWorkout,
  listWorkouts,
  updateWorkout,
  deleteWorkout,
  removeExerciseFromProgram,
  getExerciseProgress,
  createWorkoutSchedule,
  updateWorkoutSchedule,
  deleteWorkoutSchedule,
} from './workout-controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         name:
 *           type: string
 *           example: Pull A
 *         description:
 *           type: string
 *           example: A pull-type workout routine
 *         userId:
 *           type: integer
 *           example: 1
 *     WorkoutInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Pull A
 *         description:
 *           type: string
 *           example: A pull-type workout routine
 *         userId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/v1/workout:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutInput'
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateJwt, asyncHandler(createWorkout));

/**
 * @swagger
 * /api/v1/workout:
 *   get:
 *     summary: Retrieve a list of workouts
 *     tags: [Workouts]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: List of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 */
router.get('/', authenticateJwt, asyncHandler(listWorkouts));

/**
 * @swagger
 * /api/v1/workout/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutInput'
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 */
router.put('/:id', authenticateJwt, asyncHandler(updateWorkout));

/**
 * @swagger
 * /api/v1/workout/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workouts]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *       404:
 *         description: Workout not found
 */
router.delete('/:id', authenticateJwt, asyncHandler(deleteWorkout));

/**
 * @swagger
 * /api/v1/workout/program/{programId}/exercise/{exerciseId}:
 *   delete:
 *     summary: Remove an exercise from a workout program
 *     tags: [Workouts]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout Program ID
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise removed from program successfully
 *       404:
 *         description: Program or exercise not found
 */
router.delete(
  '/program/:programId/exercise/:exerciseId',
  authenticateJwt,
  asyncHandler(removeExerciseFromProgram),
);

/**
 * @swagger
 * /api/v1/workout/progress/{userId}/exercise/{exerciseId}:
 *   get:
 *     summary: Get exercise progress data for a user
 *     tags: [Workouts]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise progress data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   performedAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2023-01-01T12:00:00Z'
 *                   sets:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         reps:
 *                           type: integer
 *                           example: 10
 *                         weight:
 *                           type: number
 *                           format: float
 *                           example: 50.0
 *       404:
 *         description: No progress data found
 */
router.get(
  '/progress/:userId/exercise/:exerciseId',
  authenticateJwt,
  asyncHandler(getExerciseProgress),
);

router.post(
  '/workout/schedule',
  authenticateJwt,
  asyncHandler(createWorkoutSchedule),
);
router.put(
  '/workout/schedule/:id',
  authenticateJwt,
  asyncHandler(updateWorkoutSchedule),
);
router.delete(
  '/workout/schedule/:id',
  authenticateJwt,
  asyncHandler(deleteWorkoutSchedule),
);

export default router;
