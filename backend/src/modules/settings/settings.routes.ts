import { Router } from "express";
import { fetchAllSettings, updateSettingsBulk } from "./settings.controller";
import { requireRoles } from "../../common/middleware/auth.middleware";

const router = Router();

// Public route for fetching settings
router.get("/", fetchAllSettings);

// Admin route for updating settings
router.put("/", requireRoles('super_admin', 'admin'), updateSettingsBulk);

export default router;
