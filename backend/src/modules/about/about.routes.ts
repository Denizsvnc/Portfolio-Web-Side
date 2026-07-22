import { Router } from "express";
import { createAboutSection, getAllAboutSections, getAboutSection, updateAboutSection, deleteAboutSection } from './about.controller';
import { requireRoles } from '../../common/middleware/auth.middleware';

const router = Router();

router.get("/", getAllAboutSections);
router.get("/:id", getAboutSection);
router.post("/", requireRoles('super_admin', 'admin'), createAboutSection);
router.put("/:id", requireRoles('super_admin', 'admin'), updateAboutSection);
router.delete("/:id", requireRoles('super_admin'), deleteAboutSection);

export default router;