import React from 'react'
import { useState } from 'react'
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {Video as V, FileImage} from "lucide-react"
// eslint-disable-next-line no-unused-vars
import {motion} from "framer-motion"

export function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("idle"); // "idle" | "uploading" | "processing" | "done"
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate(); 

  const uploadHandler = async(e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !videoFile) {
        toast.error("Please fill all fields", {id: "provide all credentials"});
        return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title)
      formData.append("description", description)
      formData.append("videoFile", videoFile)
      if (thumbnail) {
        formData.append("thumbnail", thumbnail) // only send if user picked one
      }
      
      
      setPhase("uploading");
      setProgress(0);

      const res = await api.post("/videos", formData, {
        withCredentials: true,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
          if (percent === 100) setPhase("processing"); // switch phase here
        },
      });

      setPhase("done");
      toast.success("Video uploaded successfully");
      navigate(`/player/${res.data.data._id}`);
    } catch (error) {
      console.log("upload error:", error.response?.data)
      toast.error("Something went wrong", {id: "upload error"})
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Upload a Video</h1>
          <p className="text-zinc-400 mt-2">
            Share your content with the world.
          </p>
        </div>

        <form onSubmit={uploadHandler} className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8 space-y-8" >
          {/* Video Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Video File</h2>
            
            <label
              htmlFor="videoUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-2xl h-56 cursor-pointer hover:border-red-500 hover:bg-zinc-800/50 transition"
            >
              <div className="text-5xl mb-4">
                <V className='size-15'/>
              </div>
              <p className="text-lg font-medium">Choose a video to upload</p>
              <p className="text-sm text-zinc-400 mt-1">
                MP4, MOV, AVI supported
              </p>
            </label>

            <input
              type="file"
              id="videoUpload"
              className="hidden"
              accept="video/*"
              onChange={(e) =>{
                const file = e.target.files?.[0]
                if(file){
                  setVideoFile(file);
                }
              }}
            />
            
            {videoFile && <div className='text-white'>
                <p>file name : {videoFile.name}</p>
                <p>size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p>Type: {videoFile.type}</p>
              </div>}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Thumbnail</h2>

            <label
              htmlFor="thumbnailUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-2xl h-44 cursor-pointer hover:border-blue-500 hover:bg-zinc-800/50 transition"
            >
              <div className="text-4xl mb-3 ">
                <FileImage className='font-light size-15'/>
              </div>
              <p className="font-medium">Upload thumbnail</p>
              <p className="text-sm text-zinc-400 mt-1">
                JPG, PNG supported
              </p>
            </label>

            <input
              type="file"
              id="thumbnailUpload"
              className="hidden"
              accept="image/*"
              onChange={(e) =>{
                const file = e.target.files?.[0];
                if(file){
                  setThumbnail(file);
                }
              }}
            />
            {thumbnail && <div className='text-white'>
                <img src={URL.createObjectURL(thumbnail)} className="mt-2 rounded-xl h-32 object-cover" />
                <p>file name : {thumbnail.name}</p>
                <p>size: {(thumbnail.size/1024).toFixed(2)} KB</p>
                <p>Type: {thumbnail.type}</p>
              </div>}
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              rows={5}
              placeholder="Tell viewers about your video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none resize-none focus:border-red-500 transition"
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              type='submit'
              className="bg-linear-to-r from-red-500 to-pink-600 text-white shadow-lg hover:from-red-600 hover:to-pink-700 px-6 py-3 rounded-xl font-semibold transition"
              disabled = {loading}
            >
              {loading ? "Uploading..." : "Publish Video"}
            </motion.button>
          </div>

          {/*Progress bar and processing info */}
          {loading && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>
                  {phase === "uploading" ? `Uploading... ${progress}%` : "Processing on server..."}
                </span>
              </div>

              {/* Upload progress bar */}
              {phase === "uploading" && (
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                  <div
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Indeterminate spinner for server processing */}
              {phase === "processing" && (
                <div className="w-full bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-yellow-400 h-1.5 rounded-full animate-pulse w-full" />
                </div>
              )}
            </div>
          )}

          {phase === "done" && (
            <p className="text-green-400 text-sm text-center">✓ Uploaded successfully</p>
          )}
        </form>

      </div>
    </div>
  )
}
