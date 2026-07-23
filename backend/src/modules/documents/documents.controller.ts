import type { Request, Response } from 'express';

export const uploadDocumentController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenemedi.' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

    res.status(201).json({
      url: fileUrl,
      name: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Döküman yüklenirken bir hata oluştu.' });
  }
};
