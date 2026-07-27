import type { Request, Response, NextFunction } from "express";
import { getAllSettings, upsertSetting } from "./settings.service";

export const fetchAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await getAllSettings();
    return res.status(200).json({ message: "Ayarlar başarıyla getirildi.", data: settings });
  } catch (error) {
    return next(error);
  }
};

export const updateSettingsBulk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: Record<string, string> = req.body;
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ message: "Geçersiz ayar formatı." });
    }
    
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === "string") {
        await upsertSetting(key, value);
      }
    }
    
    const updatedSettings = await getAllSettings();
    return res.status(200).json({ message: "Ayarlar başarıyla güncellendi.", data: updatedSettings });
  } catch (error) {
    return next(error);
  }
};
