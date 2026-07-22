import type { Response, NextFunction } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import type { AuthRequest } from '../../modules/auth/auth.types';

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
    }

    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
  }
};

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
        }

        const decoded = AuthService.verifyAccessToken(token);
        req.user = decoded;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: `Bu işlem için yetkiniz bulunmamaktadır. Gerekli rol(ler): ${allowedRoles.join(', ')}` 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
  };
};

export const requireSuperAdmin = requireRoles('super_admin');