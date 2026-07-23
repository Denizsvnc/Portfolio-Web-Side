import { Router } from "express";
import { createBlogSection, getAllBlogSections, getBlogSection, shareBlogSection, updateBlogSection, deleteBlogSection } from './blogs.controller';
import { requireRoles } from '../../common/middleware/auth.middleware';

const router = Router();

router.get("/", getAllBlogSections);
router.get("/:id", getBlogSection);
router.post("/:id/share", shareBlogSection);
router.post("/", requireRoles('super_admin', 'admin'), createBlogSection);
router.put("/:id", requireRoles('super_admin', 'admin'), updateBlogSection);
router.delete("/:id", requireRoles('super_admin'), deleteBlogSection);

export default router;
