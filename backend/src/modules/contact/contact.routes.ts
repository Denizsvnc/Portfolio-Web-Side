import { Router } from "express";
import { sendMessage, getAllMessages, readMessage, replyMessage, getEmailSettings, updateEmailSettings, getThread } from "./contact.controller";
import { requireRoles } from "../../common/middleware/auth.middleware";
import { uploadAttachments } from "../../common/middleware/upload.middleware";

const router = Router();

// Public routes
router.post("/send", sendMessage);

// Admin routes
router.get("/messages", requireRoles('super_admin', 'admin'), getAllMessages);
router.get("/messages/:id/replies", requireRoles('super_admin', 'admin'), getThread);
router.post("/messages/:id/read", requireRoles('super_admin', 'admin'), readMessage);
router.post("/messages/:id/reply", requireRoles('super_admin', 'admin'), uploadAttachments.array('attachments', 5), replyMessage);

router.get("/settings", requireRoles('super_admin', 'admin'), getEmailSettings);
router.put("/settings", requireRoles('super_admin', 'admin'), updateEmailSettings);

export default router;
