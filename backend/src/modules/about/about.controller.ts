import type { Request, Response } from 'express';
import { createAbout, updateAbout, getAbout, getAllAbout, deleteAbout } from './about.service';

export const createAboutSection = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await createAbout(data);
    return res.status(201).json({ message: 'Hakkında bölümü başarıyla oluşturuldu.', data: result });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Hakkında bölümü oluşturulurken bir hata oluştu.' });
  }
};

export const updateAboutSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const data = req.body;
    const result = await updateAbout(id, data);
    return res.status(200).json({ message: 'Hakkında bölümü başarıyla güncellendi.', data: result });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Hakkında bölümü güncellenirken bir hata oluştu.' });
  }
};

export const getAllAboutSections = async (req: Request, res: Response) => {
  try {
    const result = await getAllAbout();
    return res.status(200).json({ message: 'Hakkında bölümleri başarıyla getirildi.', data: result });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Hakkında bölümleri getirilirken bir hata oluştu.' });
  }
};

export const getAboutSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const result = await getAbout({ id });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Hakkında bölümü bulunamadı.' });
    }

    return res.status(200).json({ message: 'Hakkında bölümü başarıyla getirildi.', data: result[0] });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Hakkında bölümü getirilirken bir hata oluştu.' });
  }
};

export const deleteAboutSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const result = await deleteAbout({ id });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Hakkında bölümü bulunamadı.' });
    }

    return res.status(200).json({ message: 'Hakkında bölümü başarıyla silindi.', data: result[0] });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Hakkında bölümü silinirken bir hata oluştu.' });
  }
};