import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from './user-controller';

const router = Router();

router.post('/users', createUser);

router.get('/users', getUsers);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

export default router;
