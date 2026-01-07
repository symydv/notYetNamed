import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Like } from "../models/like.model.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {tweetContent} = req.body
    if (!tweetContent) {
        throw new ApiError(400, "Can not post empty tweet")
    }

    const tweet = await Tweet.create({
        content: tweetContent,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(400, "tweet not created")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet created successfully."))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;   
    const totalTweets = await Tweet.countDocuments({ owner: userId });


    const tweets = await Tweet
    .find({owner:userId})
    .select("content owner createdAt") //select only three fields
    .sort({ createdAt: -1 }) // most recent first
    .skip((page - 1) * limit)
    .limit(limit) //skip and limit are used to peginate.
    .populate("owner", "username avatar"); //we want owner's username and avatar field


    if (!tweets || tweets.length === 0) {
        throw new ApiError(404, "No tweets")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, {
            tweets,
            totalTweets,
            totalPages: Math.ceil(totalTweets / limit),
            currentPage: page
        }, "User Tweets fetched successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {newContent} = req.body
    if (!newContent) {
        throw new ApiError(400, "Tweet content is required.")
    }

    // Step 1: Fetch the tweet
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    // Step 2: Check if current user is the tweet owner
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet.");
    }

    // Step 3: Perform update
    tweet.content = newContent;
    await tweet.save(); // runs validators //like word limit or something.

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully."))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    // Step 1: Find the tweet first
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    // Step 2: Check if the logged-in user is the owner
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet.");
    }

    await Like.deleteMany({tweet: tweetId})
    // Step 3: Delete the tweet
    await tweet.deleteOne();
    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet deleted successfully."))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}