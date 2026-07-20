import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import {Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useState } from "react";
import { getAvatarUrl } from "../utils/cloudinary.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import Comments from "../features/Comments.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SubscribeButton from "../components/SubscribeButton.jsx";
import { useAddToHistory } from "../hooks/mutations/useAddToHistory.js";

function Player(){
  const addToHistoryMutation = useAddToHistory();
  const {videoId} = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [initialSubscribed, setInitialSubscribed] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);

  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descRef = useRef(null)

  
  const {user} = useAuth()

  const viewSentRef = useRef(false);

  async function played(videoId) {
    if (viewSentRef.current) return;

    viewSentRef.current = true;

    try {
      await api.post(`/videos/${videoId}/view`);

      if (user) {
        addToHistoryMutation.mutate(videoId);
      }
    } catch (error) {
      console.error(error);
    }
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
      setInitialSubscribed(res.data.data.isSubscribed)
      
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
    return <LoadingSpinner/>;
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
      console.log(error)
      toast.error("Something went wrong");
    }finally{
      setLikeLoading(false)
    }
    
  }

  
  return (
  <div className="w-full px-3 sm:px-6 py-2 grid grid-cols-1 lg:grid-cols-9">
    <Helmet>
      <title>
        {video?.title ? `${video.title} - Tapes` : "Loading... - Tapes"}
      </title>
    </Helmet>
    <div className="w-full max-w-6xl col-span-1 lg:col-span-7">
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
            <Link 
              className="text-stone-100 font-medium leading-tight cursor-pointer"
              to={`/channel/${video.owner.username}`}
            >
              {video.owner.username}
            </Link>
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
              transition-all duration-200 cursor-pointer
              "bg-stone-800 text-white hover:bg-stone-700"
              active:scale-95
              ${likeLoading ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {!isLiked ? (
              // NOT LIKED → hollow
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: "scaleX(-1)" }}
              >
                <path d="M1 21h4V9H1v12z" />
                <path d="M23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            ) : (
              // LIKED → filled white
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={{ transform: "scaleX(-1)" }}
                >
                  <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
            )}
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          {/* Subscribe */}
          <SubscribeButton channel={video.owner} initialSubscribed={initialSubscribed}/>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5 w-full bg-gray-800 rounded-2xl p-4">
        <h1 className="font-semibold text-white">Description</h1>
        <p
          ref={descRef}
          className={`
            text-white text-sm leading-relaxed
            whitespace-pre-wrap wrap-break-word
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