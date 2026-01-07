import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found.")
    }

    const subscriber = req.user ;
    let message = ""
    let isSubscribed;
    if (channelId.toString() === subscriber._id.toString()) {
        throw new ApiError(400, "You can not subscribe your own channel.")
    }else{
        const alreadySubscribed = await Subscription.findOne({subscriber : subscriber._id, channel: channelId})
        if (alreadySubscribed) {
            await Subscription.deleteOne({_id: alreadySubscribed._id})
            message = "Channel unsubscribed successfully."
            isSubscribed = false;
        }else{
            await Subscription.create({
            channel: channelId,
            subscriber: subscriber._id
            })
            message = "Channel subscribed successfully."
            isSubscribed = true;
        }
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {"isSubscribed":isSubscribed}, message))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404,"channel not found")
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subscribers = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(channelId) //first we matched channel from all the users 
            }
        },
        {
            $lookup:{
                //we will get all subscriptions which include our channel
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
                pipeline: [
                    {
                        $lookup: {
                            //then we can check all the users who subscribed from those subscriptions 
                            from: "users",
                            localField: "subscriber",
                            foreignField: "_id",
                            as: "subscriberUser"
                            }
                    },
                    {
                        $unwind: "$subscriberUser" //$unwind to flatten the array.
                    },
                    {
                        $project: {
                            _id: "$subscriberUser._id",
                            username: "$subscriberUser.username",
                            avatar: "$subscriberUser.avatar"
                        }
                    }
                ]
            }
        },
        {
            $project:{
                subscriberCount:{ $size: "$subscribers" }, //using this we elemenated the need of saperate "$addFields".
                subscriberList: {
                    $slice: ["$subscribers", skip, limit] //pegination
                }
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, {
        "Info": subscribers[0],currentPage: page,
        totalPages: Math.ceil((subscribers[0]?.subscriberCount || 0) / limit)
    }, "channel subscribers fetched successfully"))
    //we wrote subscribers[0], Since the aggregation returns an array, and you're only matching by one "channelId".
    

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (subscriberId.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "you can not access someone else's subscription list.")
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const channels = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "mySubscriptions",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "channel",
                            foreignField: "_id",
                            as: "subChannels"
                        }
                    },
                    {
                        $unwind: "$subChannels"
                    },
                    {
                        $project: {
                            _id: "$subChannels._id",
                            username: "$subChannels.username",
                            avatar: "$subChannels.avatar"
                        }
                    }
                    
                ]
            }
            
        },
        {
            $project: {
                totalSubscriptions: {$size: "$mySubscriptions"},
                subscriptionList: {
                    $slice: ["$mySubscriptions", skip, limit]
                }
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,{
        "Info": channels[0],currentPage: page,
        totalPages: Math.ceil((channels[0]?.totalSubscriptions || 0) / limit)
    }, "All the subscriptions fetched successfully."))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}