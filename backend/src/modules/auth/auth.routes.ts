import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', requireAuth, AuthController.logout);

export default router;