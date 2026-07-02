import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/channel.controller.js"
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';

const router = Router();


router.route("/stats/:username").get(optionalAuth,getChannelStats);
router.route("/videos/:username").get(getChannelVideos);

export default router