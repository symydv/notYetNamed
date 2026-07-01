import React from 'react'
import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import api from "../api/axios"
function Channel() {
  const username = useParams().username;
  console.log(username)
  const {user} = useAuth();
  const [channel, setChannel] = useState("");
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
  
  return (
    <div className='pl-8 pr-8'>
      <div className='max-h-full rounded-2xl bg-black'>
        <div className="h-40 bg-linear-to-r from-blue-500 to-red-500 rounded-xl" />
      </div>
      <div className='max-h-full bg-amber-300'>
        header
      </div>
      <div className='max-h-full bg-amber-300'>
        Tabs
      </div>
    </div>
  )
}

export default Channel