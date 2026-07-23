import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';

// 1. MULTER AYARLARI (Dosyayı geçici olarak RAM'de tutar)
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyalarına izin verilmektedir.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7 MB limit
  fileFilter: fileFilter
});

// 1.5 ATTACHMENT UPLOAD (Disk Storage, All Files Allowed)
const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/attachments/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export const uploadAttachments = multer({
  storage: attachmentStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit for emails
});

// 2. WEBP DÖNÜŞTÜRÜCÜ MIDDLEWARE   
export const convertToWebp = async (req: Request, res: Response, next: NextFunction) => {
  // Eğer dosya yüklenmemişse sonrakine geç (Belki güncelleme işleminde dosya gönderilmemiştir)
  if (!req.file) return next();

  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Benzersiz isim oluştur ve uzantıyı .webp yap
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${req.file.fieldname}-${uniqueSuffix}.webp`;
  const filepath = path.join(uploadDir, filename);

  try {
    // Sharp ile bellekteki (buffer) dosyayı al, webp yap ve kaydet
    await sharp(req.file.buffer)
      .webp({ quality: 80 }) // %80 kalite, boyut/görüntü oranı için idealdir
      .toFile(filepath);

    req.file.filename = filename;
    req.file.path = filepath;
    req.file.mimetype = 'image/webp';
    req.file.buffer = Buffer.alloc(0); 

    next();
  } catch (error) {
    next(new Error('Görsel işlenirken bir hata oluştu.'));
  }
};