import { useNavigate, Link} from 'react-router-dom'
import { useRef } from 'react';
import { MoreVerticalIcon } from 'lucide-react';
import { timeAgo } from '../../utils/timeAgo';
import { getThumbnailUrl, getAvatarUrl } from '../../utils/cloudinary';
import VideoActions from './VideoActions';


function VideoCard({video, showOwner=true, actions, isMenuOpen, onToggleMenu}) { //we dont need to show owner info on channel page.
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return (
    <div
      onClick={() => navigate(`/player/${video._id}`)} className="rounded-2xl hover:saturate-125 hover:bg-zinc-800 px-1 py-2 relative">
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
        {showOwner && (
          <div className="text-black">
            <Link to={`/channel/${video.owner.username}`} onClick={(e) => e.stopPropagation()}>
              <div className="top-0 rounded-2xl bg-white size-8">
                <img
                  className="w-8 h-8 rounded-full cursor-pointer"
                  src={getAvatarUrl(video.owner.avatar || `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`)}
                  alt="Profile"
                />
              </div>
            </Link>
          </div>
        )}

        <div className="flex flex-1 justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <h3 className="text-stone-100 font-semibold text-sm line-clamp-2">{video.title}</h3>
            {showOwner && (
              <Link
                to={`/channel/${video.owner.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-zinc-300 hover:text-white font-light"
              >
                {video.owner.fullName}
              </Link>
            )}
            <div className="flex gap-1 text-xs font-semibold text-zinc-400">
              <h5>{video.views} views</h5>
              <div>•</div>
              <div>{timeAgo(video.createdAt)}</div>
            </div>
          </div>

          <div className="shrink-0 relative flex text-white">
            <div className="flex justify-center h-fit w-fit"> 
              <div
                ref={menuButtonRef}
                className="rounded-full p-2 hover:bg-gray-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu(video._id);
                }}
              >
                <MoreVerticalIcon className="size-4" />
              </div>
            </div>
            
            <VideoActions 
              isOpen={isMenuOpen} 
              onClose={() => onToggleMenu(null)} 
              actions={actions} 
              anchorRef={menuButtonRef}
            />
          </div>
        </div>
      </div>
    </div >
  )
}

export default VideoCard