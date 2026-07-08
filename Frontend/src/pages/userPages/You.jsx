import{ useEffect } from 'react'

import { useAuth } from '../../context/AuthContext';
function You() {
  const {user} = useAuth();

 
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 border-b border-zinc-700">
        History
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