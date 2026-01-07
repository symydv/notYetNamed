import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name){
        throw new ApiError(400, "Playlist name is required.")
    }

    const newPlaylist = await Playlist.create({
        name: name,
        description: description || "",
        owner: req.user._id
    }) 

    if (!newPlaylist) {
        throw new ApiError(500, "something went wrong while creating playlist.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "Playlist created successfully."))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allUserPlaylists = await Playlist.find({owner: userId}).skip(skip).limit(limit) 
    
    
    if (!allUserPlaylists || allUserPlaylists.length === 0) {
        throw new ApiError(404, "This user does not have any playlist.")
    }

    const totalPlaylists = await Playlist.countDocuments({owner: userId})

    return res
    .status(200)
    .json(new ApiResponse(200, {
        allUserPlaylists,
        "TotalPlaylists": totalPlaylists,
        totalPages: Math.ceil(totalPlaylists / limit),
        currentPage: page }, "All user playlist fetched."))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    const playlist = await Playlist.findById(playlistId).populate("owner", "username avatar")
    .populate("videos", "title duration thumbnail");

    if (!playlist) {
        throw new ApiError(404, "playlist not found.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully."))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (
        !mongoose.Types.ObjectId.isValid(playlistId) ||
        !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid playlist or video ID.");
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found.")
    }
    
    const playlist = await Playlist.findById(playlistId)
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can not add video to someone else's playlist")
    }
    
    for (let vId of playlist.videos) {
        if (vId.toString() === videoId.toString()) {
            throw new ApiError(400, "video already exists in this playlist.")
        }
    }

    playlist.videos.push(videoId);
    await playlist.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200,playlist, "video added to playlist successfully"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (
        !mongoose.Types.ObjectId.isValid(playlistId) ||
        !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid playlist or video ID.");
    }

    const playlist = await Playlist.findById(playlistId);

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can not delete video from someone else's playlist")
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in this playlist.");
    }

    playlist.videos = playlist.videos.filter( (vId) => vId.toString() !== videoId.toString())

    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "video deleted from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.")
    }

    if (playlist.owner.toString() !== req.user._id.toString() ) {
        throw new ApiError(403, "you can not delete someone else's playlist.")
    }

    await playlist.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200,{deletedId: playlistId} ,"playlist successfully deleted."))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"Playlist not found.")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can not update someone else's playlist.")
    }

    playlist.name = name || playlist.name
    playlist.description = description || playlist.description

    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playllist updateed successfully."))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}