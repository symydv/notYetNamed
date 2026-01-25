import React, { useRef } from "react";
import { useEffect } from "react";
import { isSession, useParams } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import { getAvatarUrl } from "../utils/cloudinary";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/timeAgo.js";
import Comments from "./Comments.jsx";

function Player(){
  const {videoId} = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const [likeLoading, setLikeLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descRef = useRef(null)

  
  const {user} = useAuth()

  const viewSentRef = useRef(false);

  async function played(videoId) {
    if (viewSentRef.current) return;

    viewSentRef.current = true;
    await api.post(`/videos/${videoId}/view`);
  }

  useEffect(() => {
    const getVideo = async()=>{
      setLoading(true)
      const res = await api.get(`/videos/${videoId}`)
      setVideo(res.data.data.video);
      setIsLiked(res.data.data.isLiked);
      // console.log(res.data.data.isLiked);
      setLikeCount(res.data.data.video.likeCount);
      // console.log(res.data.data.isSubscribed);
      setIsSubscribed(res.data.data.isSubscribed)
      
      setLoading(false)
    }
    getVideo()
  },[videoId])

  useEffect(() => {
    if (!descRef.current ) return

    const el = descRef.current
    setIsOverflowing(el.scrollHeight > el.clientHeight) //check them on GPT. easy
  }, [video?.description])

  if (loading) {
    return <p className="text-white p-4">Loading...</p>;
  }

  const likeHandler  = async()=>{
    if(!user){
      toast("Sign in to like", {id: "login required"}); //use id so that the same toast gets updated on continous clicking.
      return;
    }

    if(likeLoading) return;

    try {
      setLikeLoading(true)
      const res = await api.post(`/likes/toggle/v/${videoId}`)
      setIsLiked(res.data.data.isLiked);
      setLikeCount(res.data.data.likeCount)
    } catch (error) {
      toast.error("Something went wrong");
    }finally{
      setLikeLoading(false)
    }
    
  }

  const subscriptionHandler = async()=>{
    if(!user){
      toast("sign in to subscribe", {id: "login required"})
      return;
    }

    if(subLoading) return;

    try {
      setSubLoading(true)
      const res = await api.patch(`/subscriptions/${video.owner._id}`)
      setIsSubscribed(res.data.data.isSubscribed)
    } catch (error) {
      toast.error("Something went wrong")
    }finally{
      setSubLoading(false)
    }
  }
  
  return (
  <div className="w-full px-6 py-4 flex justify-start">
    <div className="w-full max-w-6xl">
      {/* Video */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full object-contain block"
          preload="metadata"
          controlsList="nodownload"
          onPlay={() => played(videoId)}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Title */}
      <h1 className="mt-4 text-white text-xl font-semibold leading-snug">
        {video.title}
      </h1>

      {/* Views + Time */}
      <div className="mt-1 flex items-center gap-2 text-sm text-stone-400">
        <span>{video.views.toLocaleString()} views</span>
        <span>•</span>
        <span>{new Date(video.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </span>
      </div>

      {/* Channel + Actions */}
      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
        {/* Channel info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={getAvatarUrl(
                video.owner.avatar ||
                  `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`
              )}
              alt=""
              className="w-full h-full object-cover block"
            />
          </div>

          <div>
            <div className="text-stone-100 font-medium leading-tight cursor-pointer">
              {video.owner.username}
            </div>
            <div className="text-stone-400 text-sm">
              {video.owner.subscriberCount} subscribers
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Like */}
          <button
            disabled={likeLoading}
            onClick={likeHandler}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              transition-all duration-200
              ${isLiked
                ? "bg-blue-100 text-blue-600"
                : "bg-stone-800 text-white hover:bg-stone-700"}
              active:scale-95
              ${likeLoading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 11v10M15 21H9a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6l1-4a2 2 0 0 0-2-2h-1" />
            </svg>
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          {/* Subscribe */}
          <button
            disabled={subLoading}
            onClick={subscriptionHandler}
            className={`
              px-4 py-2 rounded-full font-medium transition
              ${isSubscribed
                ? "bg-slate-700 text-stone-400"
                : "bg-white text-black"}
              ${
                subLoading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-slate-500 hover:text-stone-200"
              }
            `}
          >
            {subLoading
              ? "Processing..."
              : isSubscribed
              ? "Subscribed"
              : "Subscribe"}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5 w-full bg-gray-800 rounded-2xl p-4">
        <h1 className="font-semibold text-white">Description</h1>
        <p
          ref={descRef}
          className={`
            text-white text-sm leading-relaxed
            whitespace-pre-wrap break-words
            transition-all duration-200
            ${expanded ? "" : "line-clamp-2 md:line-clamp-3"}
          `}
        >
          {video.description}
        </p>

        {isOverflowing && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-stone-300 hover:text-white"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Comments */}
      <Comments videoId={videoId}/>

    </div>
  </div>
);

}



export {Player}