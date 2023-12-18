// exercises-route.ts
import { Router } from 'express';
import { authenticateJwt } from '../../middleware/jwt-auth-middleware';
import { asyncHandler } from '../../utilities/errors/async-handler';
import {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} from './exercise-controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         name:
 *           type: string
 *           example: Bench Press
 *         description:
 *           type: string
 *           example: A chest exercise
 *         userId:
 *           type: integer
 *           example: 1
 *     ExerciseInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Bench Press
 *         description:
 *           type: string
 *           example: A chest exercise
 *         userId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/v1/exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseInput'
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateJwt, asyncHandler(createExercise));

/**
 * @swagger
 * /api/v1/exercises:
 *   get:
 *     summary: Retrieve a list of exercises
 *     tags: [Exercises]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 */
router.get('/', authenticateJwt, asyncHandler(getExercises));

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   put:
 *     summary: Update an exercise
 *     tags: [Exercises]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExerciseInput'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Exercise not found
 */
router.put('/:id', authenticateJwt, asyncHandler(updateExercise));

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   delete:
 *     summary: Delete an exercise
 *     tags: [Exercises]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 *       404:
 *         description: Exercise not found
 */
router.delete('/:id', authenticateJwt, asyncHandler(deleteExercise));

export default router;
