import { Router } from 'express';
import * as AuthController from './auth-controller';
import { asyncHandler } from '../utilities/errors/async-handler';

const router = Router();

router.post('/login', asyncHandler(AuthController.login));

router.post('/register', asyncHandler(AuthController.register));

export default router;
