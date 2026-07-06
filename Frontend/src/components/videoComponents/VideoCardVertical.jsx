import {useState} from 'react'
import { getThumbnailUrl } from '../../utils/cloudinary';
import { useNavigate, Link} from 'react-router-dom'
import { MoreVerticalIcon } from 'lucide-react';
import VideoActions from './VideoActions';
function VideoCardVertical({video, showOwner=true}) {
  const [openVideoActions, setOpenVideoActions] = useState(false);
  const navigate = useNavigate();
  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return (
    <div
      onClick={() => navigate(`/player/${video._id}`)} 
      className=" flex flex-4 rounded-2xl hover:brightness-110 hover:bg-zinc-800 px-1 py-2 relative h-40 gap-2 cursor-pointer"
    >
      <div className="relative col-span-1 aspect-video">
        <Link to={`/player/${video._id}`} onClick={(e) => e.stopPropagation()} className="block relative aspect-video">
          <img
            className="rounded-2xl w-full h-full object-cover pointer-events-none select-none cursor-pointer" //pointer event none to hide image/thumbnail url
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
      </div>
      
      <div className="flex relative col-span-3 gap-2 p-1.5">
        
        
        <div>
          <h3 className="text-stone-100 font-semibold ">{video.title}</h3>  {/**make changes to it later. */}
          
          <div className="flex gap-1 text-xs items-center font-semibold text-zinc-400">
            {showOwner && (
              <Link 
                to={`/channel/${video.owner.username}`} 
                onClick={(e) => e.stopPropagation()} 
                className="text-sm text-zinc-300 hover:text-white font-light"
              >
                {video.owner.fullName}
              </Link>
            )}
            <div> •</div>
            <h5>{video.views} views</h5>
          </div>  
        </div>
        
      </div>
      <div 
        className='absolute z-10 right-2 top-2 flex hover:bg-gray-500 p-2 items-center  justify-center cursor-pointer text-white rounded-full'
        onClick={(e) => {
          e.stopPropagation()
          setOpenVideoActions(!openVideoActions)
        }}
      >
        <MoreVerticalIcon className='size-4'/>
      </div>
      {openVideoActions && (
        <div>
          <VideoActions openVideoActions={openVideoActions} setOpenVideoActions={setOpenVideoActions} video={video}/>
        </div>
      )}
    </div >
  )
}

export default VideoCardVertical