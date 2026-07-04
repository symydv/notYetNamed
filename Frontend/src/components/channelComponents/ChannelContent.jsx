//imported in Channel.jsx
import ChannelVideos from './ChannelVideos'
import ChannelPlaylists from './ChannelPlaylists'
import ChannelPosts from './ChannelPosts'
function ChannelContent({currentTab, channel}) {
  switch(currentTab){
    case "Videos": return <ChannelVideos channel={channel} />;
    case "Playlists": return <ChannelPlaylists channel={channel} />;
    case "Posts": return <ChannelPosts channel={channel} />;
    default: return null;
  }
}

export default ChannelContent