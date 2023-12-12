import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

const handleAsyncErrors =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };

// Mock data
const users = [
  { id: 1, name: 'User 1', workouts: [] },
  { id: 2, name: 'User 2', workouts: [] },
];

// Get all users
router.get(
  '/',
  handleAsyncErrors(async (req: Request, res: Response) => {
    res.json(users);
  }),
);

// Get a specific user by id
router.get(
  '/:id',
  handleAsyncErrors(async (req: Request, res: Response) => {
    if (req.params.id !== undefined) {
      const id = parseInt(req.params.id);
      const user = users.find((user) => user.id === id);
      if (user !== undefined) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } else {
      res.status(400).send('Bad Request: ID is required');
    }
  }),
);

// Add a new user
router.post(
  '/',
  handleAsyncErrors(async (req: Request, res: Response) => {
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      workouts: req.body.workouts,
    };
    users.push(newUser);
    res.status(201).json(newUser);
  }),
);

export default router;
