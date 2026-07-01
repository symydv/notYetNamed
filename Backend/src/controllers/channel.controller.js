import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "Channel not found");
    }
    
    const totalVideos = await Video.countDocuments({owner: user._id, isPublished: true});

    const totalLikesViews = await Video.aggregate([
        {
            $match: {
                owner: user._id // Only videos uploaded by this user
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
    let isSubscribed = false;

    if (req.user) {
        isSubscribed = !!(await Subscription.exists({
            subscriber: req.user._id,
            channel: user._id
        }));
    }
    const isOwner = req.user && user._id.equals(req.user._id);

    const stats = totalLikesViews[0] || { totalLikes: 0, totalViews: 0 };
    return res
    .status(200)
    .json(new ApiResponse(200, {
        subscribers: user.subscriberCount, 
        totalVideos: totalVideos,
        likes: stats.totalLikes,
        views: stats.totalViews,
        avatar: user.avatar,
        coverImage: user.coverImage,
        fullName: user.fullName,
        description: user.description,
        username: user.username,
        isSubscribed: isSubscribed,
        isOwner: isOwner,
    }, "channel states fetched successFully."))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "Channel not found");
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit ;

    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: user._id,
                isPublished: true
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

    const totalVideos = await Video.countDocuments({ owner: user._id });

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