// components/channelComponents/ChannelPlaylists.jsx
import Playlists from "../Playlists.jsx";

function ChannelPlaylists({ channel }) {
  return <Playlists userId={channel._id} />;
}

export default ChannelPlaylists