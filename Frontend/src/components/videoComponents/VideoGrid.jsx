import { useState } from 'react';
import VideoCard from './VideoCard.jsx'
function VideoGrid({videos, showOwner=true, getActions}) {

  const [openMenuId, setOpenMenuId] = useState(null);
    const toggleMenu = (id) => {
      setOpenMenuId((prev) => (prev === id ? null : id));
    };

  if (videos.length === 0) {
    return <p className="text-white p-4">No videos found</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 px-3 sm:px-6 md:px-8 py-3">
      {videos.map((video) => (
        <VideoCard 
          video={video} 
          key={video._id} 
          showOwner={showOwner}
          actions={getActions?.(video)}
          isMenuOpen={openMenuId === video._id}
          onToggleMenu={toggleMenu}
        />
      ))}
    </div>
  )
}

export default VideoGrid;