import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { contactMessages, emailSettings, contactReplies } from '../../db/schema';
import type { sendMessageDto, updateSettingsDto, replyMessageDto } from './contact.types';
import nodemailer from 'nodemailer';

const escapeHTML = (str: string) => {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};

export const saveMessage = async (data: sendMessageDto) => {
    const result = await db.insert(contactMessages).values(data).returning();
    
    try {
        const settings = await getSettings();
        if (settings && settings.auto_forward) {
            const transporter = nodemailer.createTransport({
                host: settings.host,
                port: settings.port,
                secure: settings.secure,
                auth: {
                    user: settings.user,
                    pass: settings.password,
                },
            });

            const mailOptions = {
                from: `"${settings.from_email}" <${settings.user}>`,
                to: settings.user, // Admin's own email
                subject: `Web Sitenizden Yeni Mesaj: ${escapeHTML(data.subject)}`,
                html: `
                    <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                        <h2>Yeni Bir İletişim Formu Mesajı Aldınız</h2>
                        <p><strong>Gönderen:</strong> ${escapeHTML(data.name)} &lt;${escapeHTML(data.email)}&gt;</p>
                        <p><strong>Konu:</strong> ${escapeHTML(data.subject)}</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;" />
                        <p style="white-space: pre-wrap;">${escapeHTML(data.message)}</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        }
    } catch (e) {
        console.error("Auto-forward email failed:", e);
    }

    return result;
}

export const getMessages = async () => {
    const result = await db.select().from(contactMessages).orderBy(desc(contactMessages.created_at));
    return result;
}

export const getReplies = async (messageId: string) => {
    const result = await db.select().from(contactReplies).where(eq(contactReplies.message_id, messageId)).orderBy(desc(contactReplies.created_at));
    return result;
}

export const markAsRead = async (id: string) => {
    const result = await db.update(contactMessages).set({ is_read: true }).where(eq(contactMessages.id, id)).returning();
    return result;
}

export const getSettings = async () => {
    const result = await db.select().from(emailSettings).limit(1);
    return result[0];
}

export const updateSettings = async (data: updateSettingsDto) => {
    const existing = await getSettings();
    if (existing) {
        const result = await db.update(emailSettings).set(data).where(eq(emailSettings.id, existing.id)).returning();
        return result[0];
    } else {
        const result = await db.insert(emailSettings).values(data).returning();
        return result[0];
    }
}

export const sendReplyEmail = async (messageId: string, replyBody: string, attachments?: Array<{ filename: string; path: string }>) => {
    const messageResult = await db.select().from(contactMessages).where(eq(contactMessages.id, messageId));
    const msg = messageResult[0];
    if (!msg) throw new Error("Message not found");

    const settings = await getSettings();
    if (!settings) throw new Error("SMTP Settings are not configured");

    const transporter = nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        auth: {
            user: settings.user,
            pass: settings.password,
        },
    });

    const mailOptions = {
        from: `"${settings.from_email}" <${settings.user}>`, // Some SMTPs require 'user' to be the from email
        to: msg.email,
        subject: `Re: ${msg.subject}`,
        html: replyBody,
        attachments: attachments || [],
    };

    await transporter.sendMail(mailOptions);

    await db.insert(contactReplies).values({
        message_id: messageId,
        reply_body: replyBody,
        attachments: attachments ? JSON.stringify(attachments) : null,
    });

    await db.update(contactMessages).set({ is_replied: true, is_read: true }).where(eq(contactMessages.id, messageId));

    return true;
}
