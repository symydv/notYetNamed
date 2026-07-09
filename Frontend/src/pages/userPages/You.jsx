import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from '../../hooks/queries/useHistory';
import { shareAction, removeFromHistoryAction } from '../../hooks/useVideoActions';
import { useRemoveFromHistory } from '../../hooks/mutations/useRemoveFromHistory';
import { historyQueryOptions } from '../../hooks/queries/historyQueryOptions';
import VideoCardVertical from '../../components/videoComponents/VideoCardVertical';
function You() {
  const {user} = useAuth();
  const {data: videos=[], isLoading} = useHistory();
  const removeFromHistoryMutation = useRemoveFromHistory();

  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }; 

  const previewVideos = videos.slice(0, 4);
  return (
    <div className="flex flex-col h-full text-white p-4 ml-10">
      <div className="flex-1 border-b border-zinc-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-semibold">Watch history</div>
          {videos.length > 4 && (
            <Link to="/history" className="text-sm text-zinc-400 hover:text-white">
              Show all
            </Link>
          )}
        </div>
        {videos.length === 0? (
          <p>No history</p>
        ):(
          <div className="flex gap-4">
            {/* Videos */}
            <div className="flex flex-col flex-2">
              <div className="gap-2 flex">
                {previewVideos.map((video) => (
                  <div key={video._id} className='p-1'>
                    <VideoCardVertical
                      video={video}
                      vertical={true}
                      showOwner={true}
                      actions={[
                        shareAction(video), 
                        removeFromHistoryAction(
                          video,
                          removeFromHistoryMutation,
                        ),
                      ]}
                      isMenuOpen={openMenuId === video._id}
                      onToggleMenu={toggleMenu}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 border-b border-zinc-700">
        Playlists
      </div>

      <div className="flex-1">
        Liked videos
      </div>
    </div>
  );
}
export default You