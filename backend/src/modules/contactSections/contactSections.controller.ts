import type { Request, Response, NextFunction } from "express";
import * as service from "./contactSections.service";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAllContactSections();
    return res.status(200).json({ message: "İletişim butonları başarıyla getirildi.", data });
  } catch (error) {
    return next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getContactSectionById(req.params.id as string);
    if (!data) return res.status(404).json({ message: "İletişim butonu bulunamadı." });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createContactSection(req.body);
    return res.status(201).json({ message: "İletişim butonu başarıyla oluşturuldu.", data });
  } catch (error) {
    return next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.updateContactSection(req.params.id as string, req.body);
    if (!data) return res.status(404).json({ message: "İletişim butonu bulunamadı." });
    return res.status(200).json({ message: "İletişim butonu başarıyla güncellendi.", data });
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.deleteContactSection(req.params.id as string);
    if (!data) return res.status(404).json({ message: "İletişim butonu bulunamadı." });
    return res.status(200).json({ message: "İletişim butonu başarıyla silindi.", data });
  } catch (error) {
    return next(error);
  }
};
