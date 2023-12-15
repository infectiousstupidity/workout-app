import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from './user-controller';

const router = Router();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return function (req: Request, res: Response, next: NextFunction): void {
    fn(req, res, next).catch(next);
  };
}

router.post('/users', asyncHandler(createUser));
router.get('/users', asyncHandler(getUsers));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

export default router;
