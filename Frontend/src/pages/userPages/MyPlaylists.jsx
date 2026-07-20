import { Helmet } from "react-helmet-async"
import { usePlaylists } from "../../hooks/queries/usePlaylists";
import { useAuth } from "../../context/AuthContext";

function MyPlaylists({userId}) {
  const {user} = useAuth();
  const {data:playlists=[], isLoading} = usePlaylists(userId);
  return (
    <div>Playlists</div>
  )
}

export default MyPlaylists