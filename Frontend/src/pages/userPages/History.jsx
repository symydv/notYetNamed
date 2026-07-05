import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react"
import api from "../../api/axios"
import VideoCard from "../../components/VideoCard"
import VideoGrid from "../../components/VideoGrid";
function History() {
  const {user} = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async()=>{
      try {
        if(!user){
          throw new Error("user not found");
        }
        const res = await api.get(`/users/history`);
        setVideos(res.data.data)
        console.log(res.data.data)
        setLoading(true);
      } catch (error) {
        console.log("something went wrong", error);
      }finally{
        setLoading(false);
      }
    }
    fetchHistory();
  },[user])
  if(videos.length === 0) return <p className="text-white">Empty history</p>
  return (
    <div className="text-white p-4 ml-4">
      <div className="text-3xl font-bold mb-4">
        Watch history
      </div>

      <div className="flex gap-4">

        {/* Videos */}
        <div className="flex flex-col flex-2">
          <div className="gap-2">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                showOwner={false}
              />
            ))}
          </div>
        </div>
        

        {/* Sidebar */}
        <div className="flex-1">
          v
        </div>

      </div>
    </div>
  )
}

export default History