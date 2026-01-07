import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userDetails = await User.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(req.user._id)}
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "userVideos"
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField:"_id",
                foreignField:"channel",
                as: "subscriptions"
            }
        },
        {
            $project: {
                totalVideos: {$size: "$userVideos"},
                subscribers: {$size: "$subscriptions"}
            }
        }
    ])

    const totalLikesViews = await Video.aggregate([
        {
            $match: {
            owner: new mongoose.Types.ObjectId(req.user._id) // Only videos uploaded by this user
            }
        },
        {
            $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "videoLikes"
            }
        },
        {
            $addFields: {
            likeCount: { $size: "$videoLikes" }
            }
        },
        {
            $group: {
            _id: null,
            totalLikes: { $sum: "$likeCount" },
            totalViews: { $sum: "$views" }
            }
        }
    ]);

    const channelStats = userDetails[0] || { totalVideos: 0, subscribers: 0 };
    const stats = totalLikesViews[0] || { totalLikes: 0, totalViews: 0 };
    return res
    .status(200)
    .json(new ApiResponse(200, {
        subscribers:channelStats.subscribers, 
        totalVideos: channelStats.totalVideos,
        likes: stats.totalLikes,
        views: stats.totalViews
    }, "channel states fetched successFully."))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit ;

    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $sort: { createdAt: -1 } // newest first
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $project:{
                _id:1,
                title:1,
                description:1,
                videoFile:1,
                thumbnail:1,
                views:1,
                owner:1,
                createdAt: 1
            }
        }
    ])

    const totalVideos = await Video.countDocuments({ owner: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, {
            videos: channelVideos,
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: page
        }, "User videos fetched successfully."))
})

export {
    getChannelStats, 
    getChannelVideos
    }