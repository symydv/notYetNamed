import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"


const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found.");
  }

  const videoComments = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "username avatar")
    .lean(); 

  const totalComments = await Comment.countDocuments({ video: videoId });
  const hasMore = page < Math.ceil(totalComments / limit);

  
  let commentsWithLikeStatus = videoComments;

  if (req.user) {
    const commentIds = videoComments.map(c => c._id);

    const userLikes = await Like.find({
      targetType: "comment",
      targetId: { $in: commentIds },
      likedBy: req.user._id
    }).select("targetId");

    const likedSet = new Set(
      userLikes.map(like => like.targetId.toString())
    );

    commentsWithLikeStatus = videoComments.map(comment => ({
      ...comment,
      isLiked: likedSet.has(comment._id.toString())
    }));
  } else {
    // user not logged in → no likes
    commentsWithLikeStatus = videoComments.map(comment => ({
      ...comment,
      isLiked: false
    }));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videoComments: commentsWithLikeStatus,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
        hasMore
      },
      "video comments fetched successfully."
    )
  );
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video does not exist.")
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user._id
    })

    if (!comment) {
        throw new ApiError(500, "comment was not created.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment created successfully."))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {newContent} = req.body

    if (!newContent || newContent.trim() === "") {
        throw new ApiError(400, "New comment content is required.");
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "comment not found.")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can not change someone else's comment.")
    }

    comment.content = newContent
    await comment.save() //may be there are some validations on comment length.

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully."))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "comment not found.")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can not delete someone else's comment.")
    }

    await Like.deleteMany({comment:commentId})
    const deletedComment = await Comment.deleteOne({ _id: comment._id })

    return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "comment deleted successfully."))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }