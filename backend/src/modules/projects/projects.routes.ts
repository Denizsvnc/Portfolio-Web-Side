import { Router } from "express";
import { createProject, getAllProjects, getProject, updateProject, deleteProject } from './projects.controller';
import { requireRoles } from '../../common/middleware/auth.middleware';

const router = Router();

router.get("/", getAllProjects);
router.get("/:id", getProject);
router.post("/", requireRoles('super_admin', 'admin'), createProject);
router.put("/:id", requireRoles('super_admin', 'admin'), updateProject);
router.delete("/:id", requireRoles('super_admin'), deleteProject);

export default router;
