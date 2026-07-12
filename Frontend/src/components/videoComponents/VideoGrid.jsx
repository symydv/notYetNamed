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
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 px-8 py-3">
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