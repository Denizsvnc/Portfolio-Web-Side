import type { Request, Response, NextFunction } from 'express';
import { createBlog, getAllBlogs, getBlogById, shareBlogById, updateBlog, deleteBlog } from './blogs.service';

export const createBlogSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const result = await createBlog(data);
    return res.status(201).json({ message: 'Blog yazısı başarıyla oluşturuldu.', data: result[0] });
  } catch (error) {
    return next(error);
  }
};

export const getAllBlogSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllBlogs();
    return res.status(200).json({ message: 'Blog yazıları başarıyla getirildi.', data: result });
  } catch (error) {
    return next(error);
  }
};

export const getBlogSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const visitorId = req.visitor?.id;
    const ipAddress = req.visitor?.ip;
    const city = req.visitor?.city;

    const result = await getBlogById(id, visitorId, ipAddress, city);
    const blogItem = result[0];
    if (!blogItem) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı.' });
    }
    return res.status(200).json({ message: 'Blog yazısı başarıyla getirildi.', data: blogItem });
  } catch (error) {
    return next(error);
  }
};

export const shareBlogSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const visitorId = req.visitor?.id;
    const ipAddress = req.visitor?.ip;
    const city = req.visitor?.city;

    const result = await shareBlogById(id, visitorId, ipAddress, city);
    const blogItem = result[0];
    if (!blogItem) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı.' });
    }
    return res.status(200).json({ message: 'Blog yazısı paylaşımı kaydedildi.', data: blogItem });
  } catch (error) {
    return next(error);
  }
};

export const updateBlogSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const data = req.body;
    const result = await updateBlog(id, data);
    const updatedBlog = result[0];
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı.' });
    }
    return res.status(200).json({ message: 'Blog yazısı başarıyla güncellendi.', data: updatedBlog });
  } catch (error) {
    return next(error);
  }
};

export const deleteBlogSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçersiz ID parametresi.' });
    }
    const result = await deleteBlog(id);
    const deletedBlog = result[0];
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog yazısı bulunamadı.' });
    }
    return res.status(200).json({ message: 'Blog yazısı başarıyla silindi.', data: deletedBlog });
  } catch (error) {
    return next(error);
  }
};
