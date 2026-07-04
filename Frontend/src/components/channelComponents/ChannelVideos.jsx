import VideoGrid from '../VideoGrid'
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';

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

  if(loading) return <div className='flex justify-center mt-10'> <LoaderCircle className='animate-spin text-white'/> </div>
  return (
    <VideoGrid videos={videos} showOwner={false}/>
  )
}

export default ChannelVideos