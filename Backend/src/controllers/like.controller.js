import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { app } from "../app.js"
import { User } from "../models/user.model.js"
import { updateComment } from "./comment.controller.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    let isLiked;
    //TODO: toggle like on video
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    let videoLike = await Like.findOne({targetType:"video", targetId: videoId, likedBy: req.user._id});
    let message = ""

    if (videoLike) {
        await videoLike.deleteOne()
        await Video.findByIdAndUpdate(videoId, {
            $inc: { likeCount: -1 }
        });
        isLiked = false;
        message = "Video unliked successfully."
    } else {
        videoLike = await Like.create({targetType:"video", targetId: videoId, likedBy: req.user._id})
        await Video.findByIdAndUpdate(videoId, {$inc:{likeCount: 1}})
        isLiked= true
        message = "Video liked successfully."
    }

    const updatedVideo = await Video.findById(videoId).select("likeCount");

    return res
    .status(200)
    .json(new ApiResponse(200, {isLiked, likeCount:updatedVideo.likeCount }, message))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "comment not found.")
    }

    let commentLike = await Like.findOne({targetType:"comment", targetId: commentId, likedBy: req.user._id});
    let message =""
    let isLiked;
    let likeCountChange ;

    if (commentLike) {
        await commentLike.deleteOne()
        likeCountChange  = -1;
        isLiked = false;
        message = "comment unliked successfully."
    } else {
        commentLike = await Like.create({targetType:"comment", targetId: commentId, likedBy: req.user._id})
        likeCountChange  = 1;
        isLiked = true;
        message = "comment liked successfully."
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {$inc: {likeCount: likeCountChange}},
        {new: true}
    ).select("likeCount")

    return res
    .status(200)
    .json(new ApiResponse(200, {isLiked, likeCount: updatedComment.likeCount }, message))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "tweet not found.")
    }

    let tweetLike = await Like.findOne({targetType:"tweet", targetId: tweetId, likedBy: req.user._id})
    let message = ""
    if (tweetLike) {
        await tweetLike.deleteOne()
        message = "tweet  unliked successfully"
    }else{
        tweetLike = await Like.create({targetType:"tweet", targetId: tweetId, likedBy: req.user._id})
        message = "tweet liked successfully"
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweetLike, message))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [videos, totalLikedVideos] = await Promise.all([
        Like.aggregate([
            { $match: { likedBy: new mongoose.Types.ObjectId(req.user._id), targetType: "video" } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "videos",
                    localField: "targetId",
                    foreignField: "_id",
                    as: "video"
                }
            },
            { $unwind: "$video" },
            {
                $lookup: {
                    from: "users",
                    localField: "video.owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$video",
                            {
                                owner: {
                                    _id: "$owner._id",
                                    username: "$owner.username",
                                    fullName: "$owner.fullName",
                                    avatar: "$owner.avatar"
                                }
                            }
                        ]
                    }
                }
            }
        ]),
        Like.countDocuments({ likedBy: req.user._id, targetType: "video" })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalLikedVideos,
            totalPages: Math.ceil(totalLikedVideos / limit),
            currentPage: page
        }, "Liked videos fetched successfully.")
    );
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}