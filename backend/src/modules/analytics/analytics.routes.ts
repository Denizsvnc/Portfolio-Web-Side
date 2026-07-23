import { Router } from 'express';
import { requireRoles } from '../../common/middleware/auth.middleware';
import { getOverviewReport, getPageViewsReport, getCityReport, getBlogReport, getVisitorsLogReport } from './analytics.controller';

const router = Router();

router.use(requireRoles('super_admin', 'admin'));

router.get('/overview', getOverviewReport);
router.get('/pages', getPageViewsReport);
router.get('/cities', getCityReport);
router.get('/blogs', getBlogReport);
router.get('/visitors', getVisitorsLogReport);

export default router;
