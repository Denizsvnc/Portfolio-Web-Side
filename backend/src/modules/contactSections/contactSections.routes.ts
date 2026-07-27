import { Router } from "express";
import * as controller from "./contactSections.controller";
import { requireRoles } from "../../common/middleware/auth.middleware";

const router = Router();

// Public route for frontend
router.get("/", controller.getAll);

// Admin routes
router.post("/", requireRoles('super_admin', 'admin'), controller.create);
router.get("/:id", requireRoles('super_admin', 'admin'), controller.getOne);
router.put("/:id", requireRoles('super_admin', 'admin'), controller.update);
router.delete("/:id", requireRoles('super_admin', 'admin'), controller.remove);

export default router;
