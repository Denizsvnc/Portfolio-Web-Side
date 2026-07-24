import type { Request, Response } from 'express';
import { AiService } from './ai.service';
import { initAiCronJob } from './ai.cron';

function formatAiError(error: any): string {
  const msg = error?.message || String(error);
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('prepayment')) {
    return 'Google Gemini API kotanız doldu veya bakiye yetersiz! Lütfen https://aistudio.google.com adresinden yeni bir API Key alıp .env dosyasına ekleyin.';
  }
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
    return 'Geçersiz API Anahtarı! Lütfen .env dosyasındaki GEMINI_API_KEY değerini kontrol edin.';
  }
  return msg;
}

export class AiController {
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await AiService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const data = req.body;
      const updated = await AiService.updateSettings(data);
      // Re-initialize cron with new settings
      initAiCronJob().catch(console.error);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async analyzePersona(req: Request, res: Response) {
    try {
      const { answers } = req.body;
      if (!answers) {
        return res.status(400).json({ success: false, message: 'Answers are required' });
      }
      
      const result = await AiService.analyzePersona(answers);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: formatAiError(error) });
    }
  }

  static async triggerGeneration(req: Request, res: Response) {
    try {
      const { customTopic } = req.body || {};
      
      await AiService.generateBlogFlow(customTopic);
      
      res.json({ success: true, message: "AI Blog generation completed successfully." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: formatAiError(error) });
    }
  }

  static async getPlans(req: Request, res: Response) {
    try {
      const plans = await AiService.getPlans();
      res.json({ success: true, data: plans });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async addPlan(req: Request, res: Response) {
    try {
      const data = req.body;
      const newPlan = await AiService.addPlan(data);
      res.json({ success: true, data: newPlan });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deletePlan(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (!id) throw new Error("ID is required");
      await AiService.deletePlan(id);
      res.json({ success: true, message: "Plan deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
