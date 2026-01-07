import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

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
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo); //.patch : Common Use Case: You want to modify one or more properties without replacing the entire document.


router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router


//NOTE:
/*Although we can add any HTTP method and do what ever we want in function but it is important to mantain right scripts because:
It breaks RESTful API principles — the HTTP method should reflect what the server does.
Other developers (or frontend devs) will assume the DELETE route removes a resource.
It leads to confusing, hard-to-maintain code */