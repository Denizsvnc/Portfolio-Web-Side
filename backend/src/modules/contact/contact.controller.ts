import type { Request, Response } from 'express';
import { saveMessage, getMessages, markAsRead, getSettings, updateSettings, sendReplyEmail, getReplies } from './contact.service';

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message, recaptchaToken } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: "Gerekli alanlar eksik" });
            return;
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const isRecaptchaEnabled = Boolean(secretKey);
        
        if (isRecaptchaEnabled) {
            if (!recaptchaToken) {
                res.status(400).json({ success: false, message: "Lütfen robot olmadığınızı doğrulayın" });
                return;
            }
            const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${secretKey}&response=${recaptchaToken}`
            });
            const recaptchaData = await response.json() as { success: boolean };
            if (!recaptchaData.success) {
                res.status(400).json({ success: false, message: "reCAPTCHA doğrulaması başarısız" });
                return;
            }
        }

        const result = await saveMessage({ name, email, subject: subject || 'No Subject', message });
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAllMessages = async (req: Request, res: Response) => {
    try {
        const result = await getMessages();
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const readMessage = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await markAsRead(id);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const replyMessage = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { replyBody } = req.body;
        if (!replyBody) {
             res.status(400).json({ success: false, message: "Mesaj içeriği boş olamaz" });
             return;
        }

        const files = req.files as Express.Multer.File[];
        const attachments = files?.map(f => ({
            filename: f.originalname,
            path: f.path,
        })) || [];
        
        await sendReplyEmail(id, replyBody, attachments);
        res.status(200).json({ success: true, message: "Cevap e-postası başarıyla gönderildi" });
    } catch (error: any) {
        console.error("SMTP Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getEmailSettings = async (req: Request, res: Response) => {
    try {
        const result = await getSettings();
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateEmailSettings = async (req: Request, res: Response) => {
    try {
        const result = await updateSettings(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getThread = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await getReplies(id);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
