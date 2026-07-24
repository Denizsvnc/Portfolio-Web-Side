import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { sendMessage, getAllMessages, readMessage, replyMessage, getEmailSettings, updateEmailSettings, getThread } from "./contact.controller";
import { requireRoles } from "../../common/middleware/auth.middleware";
import { uploadAttachments } from "../../common/middleware/upload.middleware";

const router = Router();

// İletişim Formu için Sıkı Güvenlik (Spam Koruması) - 1 saatte maksimum 5 mesaj
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla mesaj gönderdiniz. Lütfen 1 saat sonra tekrar deneyin.",
  },
});

// Public routes
router.post("/send", contactFormLimiter, sendMessage);

// Admin routes
router.get("/messages", requireRoles('super_admin', 'admin'), getAllMessages);
router.get("/messages/:id/replies", requireRoles('super_admin', 'admin'), getThread);
router.post("/messages/:id/read", requireRoles('super_admin', 'admin'), readMessage);
router.post("/messages/:id/reply", requireRoles('super_admin', 'admin'), uploadAttachments.array('attachments', 5), replyMessage);

router.get("/settings", requireRoles('super_admin', 'admin'), getEmailSettings);
router.put("/settings", requireRoles('super_admin', 'admin'), updateEmailSettings);

export default router;
