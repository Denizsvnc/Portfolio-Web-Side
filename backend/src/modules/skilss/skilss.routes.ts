import { Router } from "express";
import { createSkillSection, getAllSkillSections, getSkillSection, updateSkillSection, deleteSkillSection } from './skilss.controller';
import { requireRoles } from '../../common/middleware/auth.middleware';

const router = Router();

router.get("/", getAllSkillSections);
router.get("/:id", getSkillSection);
router.post("/", requireRoles('super_admin', 'admin'), createSkillSection);
router.put("/:id", requireRoles('super_admin', 'admin'), updateSkillSection);
router.delete("/:id", requireRoles('super_admin'), deleteSkillSection);

export default router;
