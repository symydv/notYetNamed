import React, { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";

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
    <div className="w-full h-full flex p-2">
      {/* Player container */}
      <div className="w-full  p-0.5 ">
        
        {/* Aspect ratio wrapper */}
        <div className="aspect-video w-310 h-170 bg-black rounded-2xl overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full object-contain"
            onPlay={() => played(videoId)}
          />
        </div>

      </div>
    </div>

  )
}



export {Player}