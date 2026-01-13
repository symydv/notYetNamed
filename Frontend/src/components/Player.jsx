import React, { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import { getAvatarUrl } from "../utils/cloudinary";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Player(){
  const {videoId} = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  
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
      
      setLoading(false)
    }
    getVideo()
  },[videoId])

  if (loading) {
    return <p className="text-white p-4">Loading...</p>;
  }

  const likeHandler  = async()=>{
    if(!user){
      toast("Sign in to like", {id: "login required"}); //use id so that the same toast gets updated on continous clicking.
      return;
    }

    try {
      const res = await api.post(`/likes/toggle/v/${videoId}`)
      setIsLiked(res.data.data.isLiked);
      setLikeCount(res.data.data.likeCount)
    } catch (error) {
      toast.error("Something went wrong");
    }
    
  }

  
  return(
    <div  className="w-full px-6 py-4 flex ">
      <div className="w-full max-w-6xl">
        {/* Video */}
        <div className="aspect-video bg-black rounded-2xl overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full object-cover block"
            preload="metadata"
            controlsList="nodownload"
            onPlay={() => played(videoId)}
          />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-white text-xl font-semibold leading-snug">
          {video.title}
        </h1>

        {/* Channel row */}
        <div className="mt-3 flex items-center gap-9">
          {/*Channel info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={getAvatarUrl(video.owner.avatar || `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`)}
                alt=""
                className="w-full h-full object-cover block"
              />
            </div>

            <div>
              <div className="text-stone-100 font-medium leading-tight">
                {video.owner.username}
              </div>
              <div className="text-stone-400 text-sm">
                {video.owner.subscriberCount} subscribers
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={likeHandler}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-200
                ${isLiked
                  ? "bg-blue-100 text-blue-600"
                  : "bg-stone-800 text-white hover:bg-stone-700"}
                active:scale-95
              `}
            >
               <svg
                viewBox="0 0 24 24 "
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
            <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-stone-200 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
    
  )
}



export {Player}