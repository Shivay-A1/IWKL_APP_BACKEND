import { Router } from 'express';

const router = Router();

// Simple videos endpoint returning sample data
router.get('/', (req, res) => {
  res.json({
    videos: [
      {
        id: '1',
        title: 'IWKL Kabaddi Highlight 1',
        videoUrl: 'https://youtube.com/shorts/E8YS-cPPdZY?si=JgGJfcXqrXCRqWK9',
        thumbnailUrl: 'https://img.youtube.com/vi/E8YS-cPPdZY/hqdefault.jpg',
        category: 'Highlights',
        duration: 30,
        isPremium: false,
        viewCount: 0
      },
      {
        id: '2',
        title: 'IWKL Kabaddi Highlight 2',
        videoUrl: 'https://youtube.com/shorts/YZjFff0rfqE?si=9YAFEtAKNtyH_IQP',
        thumbnailUrl: 'https://img.youtube.com/vi/YZjFff0rfqE/hqdefault.jpg',
        category: 'Highlights',
        duration: 30,
        isPremium: false,
        viewCount: 0
      },
      {
        id: '3',
        title: 'IWKL Kabaddi Highlight 3',
        videoUrl: 'https://youtube.com/shorts/KMIeFlYcPg0?si=n45a687cXbkcnQb6',
        thumbnailUrl: 'https://img.youtube.com/vi/KMIeFlYcPg0/hqdefault.jpg',
        category: 'Highlights',
        duration: 30,
        isPremium: false,
        viewCount: 0
      }
    ]
  });
});

export default router;
