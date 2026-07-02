import React from 'react'
import { timeAgo } from '../utils/timeAgo'
import { getThumbnailUrl, getAvatarUrl } from '../utils/cloudinary'
import { useNavigate, Link} from 'react-router-dom'

function VideoCard({video}) {
  const navigate = useNavigate();
  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return (
    <div
      onClick={() => navigate(`/player/${video._id}`)} className="rounded-2xl hover:brightness-110 hover:bg-zinc-800 px-1 py-2 relative">
      <Link to={`/player/${video._id}`} onClick={(e) => e.stopPropagation()} className="block relative aspect-video">
        <img
          className="rounded-2xl w-full h-full object-cover pointer-events-none select-none cursor-pointer " //pointer event none to hide image/thumbnail url
          draggable="false"
          src={getThumbnailUrl(video.thumbnail)}
          alt={video.title}
          loading="lazy" //load the thumbnail only when needed
          decoding="async" // Load and decode the image without blocking page rendering.
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
      </Link>
      <div className="flex relative gap-2 p-1.5">
        <div className=" text-black">
          <Link
            to={`/channel/${video.owner.username}`}
            onClick={(e) => e.stopPropagation()}
          >
          <div className="top-0 rounded-2xl bg-white  size-8">
            <img 
              className="w-8 h-8 rounded-full cursor-pointer"
              src={getAvatarUrl(video.owner.avatar || `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`)} 
              alt="Profile" 
            />
          </div>
          </Link>
          
        </div>
        <div>
          <h3 className="text-stone-100 font-semibold ">{video.title}</h3>  {/**make changes to it later. */}
          <Link 
            to={`/channel/${video.owner.username}`} 
            onClick={(e) => e.stopPropagation()} 
            className="text-sm text-zinc-300 hover:text-white font-light"
          >
            {video.owner.fullName}
          </Link>
          <div className="flex gap-1">
            <h5 className="text-zinc-300 text-sm">{video.views} views(approx)</h5>
            <div className="text-zinc-300 font-extralight"> •</div>
            <div className="text-zinc-300 text-sm">{timeAgo(video.createdAt)}</div> {/**timeAgo function created in utils. */}
          </div>  
        </div>
        
      </div>
    </div >
  )
}

export default VideoCard