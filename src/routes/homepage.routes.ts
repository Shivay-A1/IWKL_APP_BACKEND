import { Router } from 'express';
import * as homepageController from '../controllers/homepage.controller';

const router = Router();

router.get('/', homepageController.getHomepageData);

export default router;
