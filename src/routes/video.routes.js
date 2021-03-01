import { Router } from 'express';
import {
  uploadVideo,
  getVideo,
  getVideos,
  deleteVideo,
  deleteAllVideos,
  getThumb,
} from '../controllers/videos.controller.js';
//
const router = Router();

router.get('/videos/:id', getVideo);

router.get('/videos/:id/thumb', getThumb);

router.get('/videos', getVideos);

router.post('/videos', uploadVideo);

router.delete('/videos/:id', deleteVideo);

router.delete('/videos', deleteAllVideos);

export default router;
