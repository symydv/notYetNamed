import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary} from "cloudinary"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"
import { Playlist } from "../models/playlist.model.js"

//TODO : After completion of whole code write aggregation pipelines to connect more things.as you need many user details like user's avatar and username , subscribers , views, likes aling with video. 

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const sortOrder = sortType === "desc" ? -1:1 ;

    const filter = {};
    // 👇 If a userId is provided in query, filter by it
    if (userId) {
        const ownerId = userId?.trim();

        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        throw new Error("Invalid userId"); // or return 400 response
        }

        filter.owner= new mongoose.Types.ObjectId(ownerId)
    }

    // 👇 If a search query is provided, add case-insensitive title match
    if (search) {
    filter.title = { $regex: search, $options: "i" }; // 'i' = case-insensitive
    }
    // filter.title	You're building a MongoDB query object to match documents where the title field...
    // { $regex: search }	...matches a regular expression pattern (basically a flexible search) based on the search string sent by the user
    // $options: "i"	"i" means case-insensitive (so "Cat" matches "cat", "CAT", etc.)

    


    const videos = await Video.find(filter)
    .populate("owner", "username avatar")      // this will change the owner field from _id to {_id, username, avatar} in response only not in database, so that we can use it for frontend without changing our video schema
    .sort({[sortBy]: sortOrder} )              //.sort({ createdAt: -1 }) // Sort by createdAt descending
    .skip((pageNumber-1)*limitNumber)          //This skips the first N documents depending on which page you're on.
    .limit(limitNumber)                        // If limitNumber = 10, you get only 10 documents per page


    const total = await Video.countDocuments(filter); //this line counts the total number of documents in our databse that matches the filter.

    // return res.status(200).json(new ApiResponse(200, videos, "videos fetched successfully"))
    return res.status(200).json({
    success: true,
    data: videos,
    pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
    }
    });

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title){
        throw new ApiError(400, "Video title is required")
    }
    if(!description){
        throw new ApiError(400, "Video description is required")
    }

    const localVideoPath = req.files?.videoFile[0]?.path;
    const localThumbnailPath = req.files?.thumbnail[0]?.path;
    if(!localVideoPath){
        throw new ApiError(400, "video is required.")
    }
    if(!localThumbnailPath){
        throw new ApiError(400, "Thumbnail is required.")
    }

    const uploadedVideo = await uploadOnCloudinary(localVideoPath)
    if (!uploadedVideo) {
        throw new ApiError(400, "video not uploaded")
    }
   
    
    
    const duration = uploadedVideo.duration; // in seconds
    // console.log("duration: ",duration);
    


    const uploadedThumbnail = await uploadOnCloudinary(localThumbnailPath)
    if (!uploadedThumbnail) {
        throw new ApiError(400, "Thumbnail not uploaded")
    }

    const finalVideo = await Video.create({
        title,
        description,
        videoFile : uploadedVideo?.url || "",
        thumbnail : uploadedThumbnail?.url || "",
        owner: req.user._id,
        isPublished: true,
        views: 0,
        duration: duration
    })

    return res
    .status(200)
    .json(new ApiResponse(200, finalVideo, "Video uploaded successfully."))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId).populate("owner", "username avatar")
    if (!video) {
        throw new ApiError(404, "video not found")   
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully."))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {newTitle, newDescription} = req.body
    const newThumbnailLocalPath = req.file?.path

    const video = await Video.findById(videoId)
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update someone else's video.");
    }

    if (!video) {
        throw new ApiError(404, "video not found")
    }
    //below code ensure that even if newThumbnail is not provided our code runs and updates other fields.
    let newThumbnail;
    if (newThumbnailLocalPath) {
        // 1. Try uploading new thumbnail first
        newThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
        if (!newThumbnail.url) {
            throw new ApiError(400, "file Upload failed.")
        }

        // 2. If upload successful, delete old thumbnail
        if (video.thumbnail) {
            try {
                const segments = video.thumbnail.split("/");
                const fileWithExt = segments.at(-1);
                const folder = segments.at(-2);
                const publicId = `${folder}/${fileWithExt.split(".")[0]}`;

                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Failed to delete old thumbnail:", err.message);
            }
        }
    }

    //below code insures that we can update whatever items we want to. So if you dont want to update any of the fieldsjust dont give input in those.
    if (newTitle?.trim()) video.title = newTitle; //just checking that title string should not just be a space " " , same goes for description.
    if (newDescription?.trim()) video.description = newDescription; 
    if (newThumbnail?.url) video.thumbnail = newThumbnail.url;
    await video.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video details updated successfully."))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    // ✅ Ownership check
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete someone else's video.");
    }


    // 2. Extract Cloudinary public_id and delete the video file
    if (video.videoFile) { //check video model.
        try {
        const videoUrl = video.videoFile;
        const segments = videoUrl.split("/");
        const fileWithExt = segments.at(-1); // e.g., abc123.mp4
        const folder = segments.at(-2); // e.g., "videos"
        const publicId = `${folder}/${fileWithExt.split(".")[0]}`; // "videos/abc123"

        await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });
        } catch (err) {
        console.error("Failed to delete video from Cloudinary:", err.message);
        }
    }

    // 3. Extract Cloudinary public_id and delete the thumbnail
    if (video.thumbnail) {
        try {
        const thumbUrl = video.thumbnail;
        const segments = thumbUrl.split("/");
        const fileWithExt = segments.at(-1);
        const folder = segments.at(-2);
        const publicId = `${folder}/${fileWithExt.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });
        } catch (err) {
        console.error("Failed to delete thumbnail from Cloudinary:", err.message);
        }
    }

    //delete all the comments on this video.
    await Comment.deleteMany({ video: videoId });

    // Delete all likes on this video
    await Like.deleteMany({ video: videoId });

    // Remove this video from all playlists that contain it
    await Playlist.updateMany(
        { videos: videoId },
        { $pull: { videos: videoId } }
    );

    //remove the video from users watch history if any
    await User.updateMany(
        { watchHistory: videoId },
        { $pull: { watchHistory: videoId } }
    );

    await Video.deleteOne({_id: videoId})

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video deleted successfully."))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to change publish status of someone else's video.");
    }

    if (!video) {
        throw new ApiError(404, "video not found.")
    }

    video.isPublished = ! video.isPublished;

    await video.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, video, "publish status Toggled successfully."))
})

const addView = asyncHandler(async(req, res) => {  //this function is added cunt approx views on video and should be updated later.
    const {videoId} = req.params

    const video = await Video.findById(videoId).select("duration totalWatchTime")

    if(!video){
        return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    
    await Video.updateOne(
        { _id: videoId },
        {
        $inc: { views: 1 }
        }
    );
    
    return res.status(200).json({ success: true });

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    addView
}