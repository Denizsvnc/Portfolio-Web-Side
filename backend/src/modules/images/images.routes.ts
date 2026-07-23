import { Router } from 'express';
import { upload, convertToWebp } from '../../common/middleware/upload.middleware';
import { requireRoles } from '../../common/middleware/auth.middleware';
import { uploadAndCreateImage, fetchAllImages, fetchImageById, updateImage, deleteImage } from './images.controller';

const router = Router();

router.get('/', fetchAllImages);
router.get('/:id', fetchImageById);
router.post('/', requireRoles('super_admin', 'admin'), upload.single('image'), convertToWebp, uploadAndCreateImage);
router.put('/:id', requireRoles('super_admin', 'admin'), updateImage);
router.delete('/:id', requireRoles('super_admin'), deleteImage);

export default router;
