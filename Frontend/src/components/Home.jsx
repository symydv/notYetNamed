import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { getAvatarUrl } from "../utils/cloudinary.js";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate()
  const search = searchParams.get("search");

  function play(videoId){
    navigate(`/player/${videoId}`)
  }

  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days/30);
    if(months < 12) return `${months} month${months>1? "s":""} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }



  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true); 

      const res = await api.get("/videos", {
        params: search ? { search } : {},
      });

      setVideos(res.data.data);
      setLoading(false);
    };

    fetchVideos();
  }, [search]);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4.5 p-4">
      {videos.length === 0 && (
        <p className="text-white">No videos found</p>
      )}
      {videos.map((video) => (
        <div onClick={()=>play(video._id)} key={video._id} className="rounded-2xl hover:bg-gray-700 px-1 py-2 ">
          <div className="relative aspect-video">
            <img
              className="rounded-2xl w-full"
              src={video.thumbnail}
              alt={video.title}
            />
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>
          <div className="flex relative gap-2 p-1.5">
            <div className=" text-black">
              <div className="top-0 rounded-2xl bg-white  size-8">
                <img 
                  className="w-8 h-8 rounded-full cursor-pointer"
                  src={getAvatarUrl(video.owner.avatar || `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`)} 
                  alt="Profile" 
                />
              </div>
              
            </div>
            <div>
              <h3 className="text-stone-100 font-semibold ">{video.title}</h3>  {/**make changes to it later. */}
              <h4 className="text-stone-100 font-light">{video.owner.username}</h4>
              <div className="flex gap-1">
                <h5 className="text-white">{video.views} views(approx)</h5>
                <div className="text-white font-extralight"> •</div>
                <div className="text-white">{timeAgo(video.createdAt)}</div>
              </div>
            </div>
            
          </div>
          
          
        </div>
      ))}
    </div>
  );
}

export {Home};
