import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react"
import api from "../../api/axios"
import LoadingSpinner from "../../components/LoadingSpinner";
import VideoCardVertical from "../../components/videoComponents/VideoCardVertical";
import VideoGrid from "../../components/videoComponents/VideoGrid";
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

  if(loading){
    return <LoadingSpinner/>
  }
  if(videos.length === 0) return <p className="text-white flex justify-center items-center text-2xl">Empty history</p>
  return (
    <div className="text-white p-4 pl-20">
      <div className="text-3xl font-bold mb-10">
        Watch history
      </div>

      <div className="flex gap-4">

        {/* Videos */}
        <div className="flex flex-col flex-2">
          <div className="gap-2">
            {videos.map((video) => (
              <VideoCardVertical
                key={video._id}
                video={video}
                showOwner={true}
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