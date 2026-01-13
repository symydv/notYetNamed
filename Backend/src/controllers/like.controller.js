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

    if (commentLike) {
        await commentLike.deleteOne()
        message = "comment unliked successfully."
    } else {
        commentLike = await Like.create({targetType:"comment", targetId: commentId, likedBy: req.user._id})
        message = "comment liked successfully."
    }

    return res
    .status(200)
    .json(new ApiResponse(200, commentLike, message))

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

    const result = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedBy",
                as: "myLikes",
                pipeline: [
                    {  $match: { targetType: "video" } },
                    {
                        $lookup: {
                            from: "videos",
                            localField: "targetId",
                            foreignField: "_id",
                            as: "likedVideo"
                        }
                    },
                    { $unwind: "$likedVideo" },
                    {
                        $lookup: {
                            from: "users",
                            localField: "likedVideo.owner",
                            foreignField: "_id",
                            as: "videoOwner"
                        }
                    },
                    { $unwind: "$videoOwner" },
                    {
                        $project: {
                            _id: 0,
                            videoId: "$likedVideo._id",
                            title: "$likedVideo.title",
                            thumbnail: "$likedVideo.thumbnail",
                            duration: "$likedVideo.duration",
                            videoUrl: "$likedVideo.videoFile",
                            owner: {
                                _id: "$videoOwner._id",
                                username: "$videoOwner.username",
                                fullName: "$videoOwner.fullName",
                                avatar: "$videoOwner.avatar"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                totalLikes: { $size: "$myLikes" },
                likedVideos: { $slice: ["$myLikes", skip, limit] }
            }
        }
    ]);

    const data = result[0] || { totalLikes: 0, likedVideos: [] };

    return res.status(200).json(
        new ApiResponse(200, {
            likedVideos: data.likedVideos,
            totalLikedVideos: data.totalLikes,
            totalPages: Math.ceil(data.totalLikes / limit),
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