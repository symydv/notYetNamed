import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    addView
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file, we dont need it here because we are allowing to get video without loggin
router
    .route("/")
    .get(getAllVideos) //if "get" request comes at "videos/" then "getAllVideos"
    .post(             // if "post" request comes at "videos/" then first comes upload field from "multer" to collect files from user then "publishVideo"
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(optionalAuth, getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo); //.patch : Common Use Case: You want to modify one or more properties without replacing the entire document.

router.route("/:videoId/view").post(addView);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router

