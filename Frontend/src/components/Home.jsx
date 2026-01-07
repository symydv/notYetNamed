import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const navigate = useNavigate()
  const search = searchParams.get("search");

  function play(videoId){
    navigate(`/player/${videoId}`)
  }

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);

      const res = await api.get("/videos", {
        params: search ? { search } : {},
      });

      setVideos(res.data.data);
      setLoading(false);
    };

    fetchVideos();
  }, [search]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {videos.length === 0 && (
        <p>No videos found</p>
      )}

      {videos.map((video) => (
        <div onClick={()=>play(video._id)} key={video._id}>
          <img src={video.thumbnail} alt={video.title}/>
          <h3 className="text-stone-100">{video.title}</h3>
        </div>
      ))}
    </div>
  );
}

export {Home};
