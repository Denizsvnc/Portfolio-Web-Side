import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { usersTable } from '../../db/schema';
import type { JwtPayload, LoginDTO } from './auth.types';

export class AuthService {
    static generateTokens(payload: JwtPayload) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123';
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key_123';

        const accessToken = jwt.sign(
            payload,
            accessTokenSecret,
            { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as any }
        );

        const refreshToken = jwt.sign(
            payload,
            refreshTokenSecret,
            { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as any }
        );

        return { accessToken, refreshToken };
    }

    static verifyAccessToken(token: string): JwtPayload {
        const secret = process.env.ACCESS_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET="c72c58f071db9e6083c0553dcdf7d2609cc12423390e36c2b9d583fb0a5994b6bcbaa8b3fbd0e1b12b12df21a587d9de62e4a7672812b0d3b53ea2898d5ec513e22cfd2dfd63a43b0baaa3a7b75297c085166d460ac0bbc28514fd9516d6ced4ace3062f678a9b21ece04e166faf0af18b9d77281c45dfe842bd1b33cb379ab15b7821fdfcdc244040c7df149804ca42dd47e4a629313fd423d033cd4bee13330bba3ce85eed145edf9ce7c2b24584f2a8f99996fd3a1d39d0651075be2a7053f10d32a09132464a1ded5b4f95569d308e9adb2697282e36429a3b57bced386c7f8bb8904fdb528bc9559874c8b2006d42b0781f2347ac17e1514ffee46189e4';
        return jwt.verify(token, secret) as JwtPayload;
    }

    static verifyRefreshToken(token: string): JwtPayload {
        const secret = process.env.REFRESH_TOKEN_SECRET || 'REFRESH_TOKEN_SECRET="c72c58f071db9e6083c0553dcdf7d2609cc12423390e36c2b9d583fb0a5994b6bcbaa8b3fbd0e1b12b12df21a587d9de62e4a7672812b0d3b53ea2898d5ec513e22cfd2dfd63a43b0baaa3a7b75297c085166d460ac0bbc28514fd9516d6ced4ace3062f678a9b21ece04e166faf0af18b9d77281c45dfe842bd1b33cb379ab15b7821fdfcdc244040c7df149804ca42dd47e4a629313fd423d033cd4bee13330bba3ce85eed145edf9ce7c2b24584f2a8f99996fd3a1d39d0651075be2a7053f10d32a09132464a1ded5b4f95569d308e9adb2697282e36429a3b57bced386c7f8bb8904fdb528bc9559874c8b2006d42b0781f2347ac17e1514ffee46189e4';
        return jwt.verify(token, secret) as JwtPayload;
    }

    static async login(credentials: LoginDTO) {
        const { email, password } = credentials;

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user) {
            throw new Error('Hatalı e-posta veya şifre.');
        }

        if (!user.is_active) {
            throw new Error('Kullanıcı hesabı pasif durumdadır.');
        }

        let isPasswordValid = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            isPasswordValid = user.password === password;
        }

        if (!isPasswordValid) {
            throw new Error('Hatalı e-posta veya şifre.');
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const tokens = this.generateTokens(payload);

        await db.update(usersTable)
            .set({ refreshToken: tokens.refreshToken })
            .where(eq(usersTable.id, user.id));

        return {
            tokens,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    static async refreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw new Error('Refresh token gereklidir.');
        }

        let decoded: JwtPayload;
        try {
            decoded = this.verifyRefreshToken(refreshToken);
        } catch {
            throw new Error('Geçersiz veya süresi dolmuş refresh token.');
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.id));
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Refresh token veritabanında bulunamadı veya geçersiz kılınmış.');
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const newTokens = this.generateTokens(payload);

        await db.update(usersTable)
            .set({ refreshToken: newTokens.refreshToken })
            .where(eq(usersTable.id, user.id));

        return newTokens;
    }

    static async logout(userId: number) {
        await db.update(usersTable)
            .set({ refreshToken: null })
            .where(eq(usersTable.id, userId));
    }
}