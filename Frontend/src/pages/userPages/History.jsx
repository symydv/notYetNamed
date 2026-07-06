import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react"
import api from "../../api/axios"
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import VideoCardVertical from "../../components/videoComponents/VideoCardVertical";
import VideoGrid from "../../components/videoComponents/VideoGrid";
function History() {
  const {user} = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteHistoryModal, setDeleteHistoryModal] = useState(false);

  useEffect(() => {
    const fetchHistory = async()=>{
      try {
        if(!user){
          throw new Error("user not found");
        }
        setLoading(true);
        const res = await api.get(`/users/history`);
        setVideos(res.data.data)
      } catch (error) {
        console.log("something went wrong", error);
      }finally{
        setLoading(false);
      }
    }
    fetchHistory();
  },[user])

  const deleteHistory = async() => {
    try {
      if(!user) return;
      const res = await api.delete(`/users/history/delete`);
      setVideos([]);
    } catch (error) {
      console.log("something went wrong");
    }
  }

  if(loading){
    return <LoadingSpinner/>
  }
  return (
    <div className="text-white p-4 pl-20">
      <div className="text-3xl font-bold mb-10">
        Watch history
      </div>
      {videos.length === 0 && <p className="text-white flex justify-center items-center text-2xl">Empty history</p>}
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
          <div className="p-10 text-md items-center font-semibold">
            <div 
              className="flex gap-2 items-center hover:bg-zinc-500 rounded-full p-2 w-fit cursor-pointer"
              onClick={() => setDeleteHistoryModal(true)}
            >
              <Trash2 className="size-5"/>
              Clear watch history
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default History