import { Router } from 'express';
import * as footerController from '../controllers/footer.controller';
import { authenticate } from '../middleware';

const router = Router();

router.get('/', footerController.getFooter);
router.put('/', authenticate, footerController.updateFooter);

export default router;
