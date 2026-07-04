import VideoGrid from '../VideoGrid'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import LoadingSpinner from '../LoadingSpinner'
import toast from 'react-hot-toast';

function ChannelVideos({channel}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await api.get("/videos", {
          params: {
            userId: channel._id,
            page:1, // no infinite scroll for now.
            limit: 12,
          },
        });
        setVideos(res.data.data);
        console.log(res.data.data)
      } catch (error) {
        toast.error("something went wrong");
      }finally {
        setLoading(false);
      }
    }
    fetchVideos();
  },[channel._id])
  if(loading) return <LoadingSpinner />
  return (
    <VideoGrid videos={videos}/>
  )
}

export default ChannelVideos