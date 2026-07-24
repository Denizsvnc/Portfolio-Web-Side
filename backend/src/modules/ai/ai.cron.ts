import * as cron from 'node-cron';
import { AiService } from './ai.service';

let activeCronJob: cron.ScheduledTask | null = null;

export const initAiCronJob = async () => {
  // If there's an existing job, stop it
  if (activeCronJob) {
    activeCronJob.stop();
  }

  try {
    const settings = await AiService.getSettings();
    if (settings.isActive && settings.scheduleCron) {
      console.log(`[AI Cron] Scheduling blog generation with cron: ${settings.scheduleCron}`);
      
      activeCronJob = cron.schedule(settings.scheduleCron, async () => {
        console.log("[AI Cron] Triggering scheduled AI Blog Generation...");
        try {
          await AiService.generateBlogFlow();
        } catch (error) {
          console.error("[AI Cron] Error generating blog:", error);
        }
      });
    } else {
      console.log("[AI Cron] AI Automation is currently inactive.");
    }
  } catch (error) {
    console.error("[AI Cron] Failed to initialize cron job:", error);
  }
};
