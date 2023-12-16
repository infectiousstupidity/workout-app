import { Router } from 'express';
import { authenticateJwt } from '../../middleware/jwt-auth-middleware';
import { asyncHandler } from '../../utilities/errors/async-handler';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from './user-controller';

const router = Router();

router.post('/users', authenticateJwt, asyncHandler(createUser));
router.get('/users', authenticateJwt, asyncHandler(getUsers));
router.put('/users/:id', authenticateJwt, asyncHandler(updateUser));
router.delete('/users/:id', authenticateJwt, asyncHandler(deleteUser));

export default router;
