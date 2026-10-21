import { Router } from 'express';
import {
  getHighlights,
  getHighlightById,
  createHighlight,
  updateHighlight,
  deleteHighlight,
  toggleHighlight,
} from '../controllers/story-highlight.controller';
import {
  getHighlightMedia,
  addMediaToHighlight,
  updateMedia,
  deleteMedia,
} from '../controllers/story-media.controller';

const router = Router();

// Highlight routes
router.get('/', getHighlights);
router.get('/:id', getHighlightById);
router.post('/', createHighlight);
router.put('/:id', updateHighlight);
router.delete('/:id', deleteHighlight);
router.patch('/:id/toggle', toggleHighlight);

// Media routes for highlights
router.get('/:id/media', getHighlightMedia);
router.post('/:id/media', addMediaToHighlight);
router.put('/:id/media/:mediaId', updateMedia);
router.delete('/:id/media/:mediaId', deleteMedia);

export default router;
