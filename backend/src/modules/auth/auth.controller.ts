import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthRequest } from './auth.types';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'E-posta ve şifre gereklidir.' });
      }

      const result = await AuthService.login({ email, password });
      return res.status(200).json({
        message: 'Giriş başarılı.',
        ...result,
      });
    } catch (error: any) {
      return res.status(401).json({ message: error.message || 'Giriş işlemi başarısız.' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token gereklidir.' });
      }

      const tokens = await AuthService.refreshToken(refreshToken);
      return res.status(200).json({
        message: 'Token başarıyla yenilendi.',
        tokens,
      });
    } catch (error: any) {
      return res.status(401).json({ message: error.message || 'Token yenileme başarısız.' });
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      if (req.user?.id) {
        await AuthService.logout(req.user.id);
      }
      return res.status(200).json({ message: 'Çıkış başarılı.' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Çıkış işlemi sırasında bir hata oluştu.' });
    }
  }
}