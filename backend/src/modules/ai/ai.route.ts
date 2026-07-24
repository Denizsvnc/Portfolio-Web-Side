import { Router } from "express";
import { AiController } from "./ai.controller";

const router = Router();

router.get("/settings", AiController.getSettings);
router.put("/settings", AiController.updateSettings);
router.post("/analyze", AiController.analyzePersona);
router.post("/trigger", AiController.triggerGeneration);

// AI Plans Routes
router.get('/plans', AiController.getPlans);
router.post('/plans', AiController.addPlan);
router.delete('/plans/:id', AiController.deletePlan);

export default router;
