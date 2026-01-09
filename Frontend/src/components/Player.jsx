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
    <div className="aspect-video p-4 flex items-center justify-center">
      <video
        src={video.videoFile}
        controls
        className="w-full h-full rounded-xl"
        onPlay={()=>{played(videoId)}}
      />
    </div>

  )
}



export {Player}