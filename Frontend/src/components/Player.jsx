import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";

function Player(){
  const {videoId} = useParams()
  const [video, setVideo] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVideo = async()=>{
      setLoading(true)
      const res = await api.get(`/videos/${videoId}`)
      setVideo(res.data.data)
      setLoading(false)
    }

    getVideo()
  },[])

  return(
    <div className="w-full outline-1 p-4">
      <video src={video.videoFile} controls></video>
    </div>
  )
}



export {Player}