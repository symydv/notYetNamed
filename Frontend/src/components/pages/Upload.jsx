import React from 'react'
import { useState } from 'react'

export function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

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

        {/* Upload Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Video Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Video File</h2>

            <label
              htmlFor="videoUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-2xl h-56 cursor-pointer hover:border-red-500 hover:bg-zinc-800/50 transition"
            >
              <div className="text-5xl mb-4">🎥</div>
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
                const file = e.target.files
                if(file){
                  setVideoFile(file);
                }
              }}
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Thumbnail</h2>

            <label
              htmlFor="thumbnailUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-2xl h-44 cursor-pointer hover:border-blue-500 hover:bg-zinc-800/50 transition"
            >
              <div className="text-4xl mb-3">🖼️</div>
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
                const file = e.target.files
                if(file){
                  setThumbnail(file);
                }
              }}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter video title"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              rows={5}
              placeholder="Tell viewers about your video"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none resize-none focus:border-red-500 transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Publish Video
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
