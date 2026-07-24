import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { AuthController } from './auth.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';

const router = Router();

// Giriş için Sıkı Güvenlik (Brute Force Koruması) - 15 dakikada maksimum 10 deneme
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla başarısız giriş denemesi yaptınız. Lütfen 15 dakika sonra tekrar deneyin.",
  },
});

router.post('/login', loginLimiter, AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', requireAuth, AuthController.logout);

export default router;