import type { Request, Response, NextFunction } from 'express';
import { createImageRecord, getAllImages, getImageById, updateImageRecord, deleteImageRecord } from './images.service';
import fs from 'fs';
import path from 'path';

export const uploadAndCreateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir resim dosyası yükleyin.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const data = req.body;

    const result = await createImageRecord(imageUrl, data);
    return res.status(201).json({
      message: 'Görsel başarıyla yüklendi ve WebP formatına dönüştürüldü.',
      data: result[0],
    });
  } catch (error) {
    return next(error);
  }
};

export const fetchAllImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllImages();
    return res.status(200).json({ message: 'Görseller başarıyla getirildi.', data: result });
  } catch (error) {
    return next(error);
  }
};

export const fetchImageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const result = await getImageById(id);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Görsel bulunamadı.' });
    }
    return res.status(200).json({ message: 'Görsel başarıyla getirildi.', data: result[0] });
  } catch (error) {
    return next(error);
  }
};

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const data = req.body;
    const result = await updateImageRecord(id, data);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Görsel bulunamadı.' });
    }
    return res.status(200).json({ message: 'Görsel başarıyla güncellendi.', data: result[0] });
  } catch (error) {
    return next(error);
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const result = await deleteImageRecord(id);
    const deletedImage = result[0];
    if (!deletedImage) {
      return res.status(404).json({ message: 'Görsel bulunamadı.' });
    }

    const imgPath = deletedImage.image_url;
    if (imgPath && imgPath.startsWith('/uploads/')) {
      const fullPath = path.join(process.cwd(), imgPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    return res.status(200).json({ message: 'Görsel ve fiziksel dosya başarıyla silindi.', data: deletedImage });
  } catch (error) {
    return next(error);
  }
};
