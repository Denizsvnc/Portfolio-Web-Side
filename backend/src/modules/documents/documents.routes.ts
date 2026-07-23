import { Router } from 'express';
import { uploadDocument } from '../../common/middleware/upload-document.middleware';
import { requireRoles } from '../../common/middleware/auth.middleware';
import { uploadDocumentController } from './documents.controller';

const router = Router();

router.post('/', requireRoles('super_admin', 'admin'), uploadDocument.single('document'), uploadDocumentController);

export default router;
