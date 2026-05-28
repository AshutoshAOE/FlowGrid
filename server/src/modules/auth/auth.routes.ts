import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validator';
import { register, login, getMe } from './auth.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(register));
router.post('/login', validateRequest(loginSchema), asyncHandler(login));

// Protected route example
router.get('/me', requireAuth, asyncHandler(getMe));

export default router;
