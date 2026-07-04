import { Router } from 'express';
import {
    addDescription,
    getChannelStats,
} from "../controllers/channel.controller.js"
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/stats/:username").get(optionalAuth, getChannelStats);
router.route("/description/:username").patch(verifyJWT, addDescription);
export default router