import React, { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import { getAvatarUrl } from "../utils/cloudinary";

function Player(){
  const {videoId} = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true);

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
      setVideo(res.data.data)
      setLoading(false)
    }

    getVideo()
  },[videoId])

  if (loading) {
    return <p className="text-white p-4">Loading...</p>;
  }

  
  return(
    <div className="w-full h-full  p-5">
      {/* Player container */}
      <div className="w-full  p-0.5 ">
        
        {/* Aspect ratio wrapper */}
        <div className="aspect-video w-310 h-170 bg-black rounded-2xl overflow-hidden  ">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full object-cover block"
            preload="metadata"  //Only loads metadata (duration, dimensions), Starts fetching video on play (to optimize a little bit)
            controlsList="nodownload"   //Hides download option in some browsers
            onPlay={() => played(videoId)}
          />
        </div>

      </div>
      <div className="p-1">
        <div className="text-white text-2xl font-semibold">{video.title}</div>
      </div>
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden translate-x-1">
          <img src={getAvatarUrl(video.owner.avatar)} alt="" className="w-full h-full object-cover block"/>
        </div>
        <div className="p-1">
          <div className="text-stone-100 font-medium">{video.owner.username}</div>
        </div>
      </div>
      
      
    </div>
    

  )
}



export {Player}