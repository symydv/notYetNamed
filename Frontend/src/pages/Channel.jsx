import React, { useMemo } from 'react'
import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import api from "../api/axios"
import LoadingSpinner from "../components/LoadingSpinner"
import ChannelBanner from '../components/channelComponents/ChannelBanner'
import ChannelInfo from '../components/channelComponents/ChannelInfo'
function Channel() {
  const username = useParams().username;
  const {user} = useAuth();
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/channel/stats/${username}`);
        setChannel(res.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }finally {
        setLoading(false);
      }
      
    };
    fetchChannel();
  }, [username]);

  if(loading) return <LoadingSpinner />
  return (
    <div className='flex flex-col pl-2 pr-2 sm:pl-15 sm:pr-15 md:pl-20 md:pr-20'>
      <ChannelBanner 
        coverImage={channel.coverImage} 
        username={username}
      />
      <ChannelInfo 
        username={username}
        channel={channel}
        user={user}
      />
      <div className='max-h-full bg-amber-300'>
        Tabs
      </div>
    </div>
  )
}

export default Channel