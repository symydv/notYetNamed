import React from 'react'
import {useState} from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
function SubscribeButton({channel, initialSubscribed}) {
  const {user} = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [subLoading, setSubLoading] = useState(false);
  const subscriptionHandler = async()=>{
    if(!user){
      toast("sign in to subscribe", {id: "login required"})
      return;
    }
    if(user._id === channel._id){
      toast.error("you can not subscribe to yourself")
      return;
    }

    if(subLoading) return;

    try {
      setSubLoading(true)
      const res = await api.patch(`/subscriptions/${channel._id}`)
      setIsSubscribed(res.data.data.isSubscribed)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }finally{
      setSubLoading(false)
    }
  }
  return (
    <button
      disabled={subLoading}
      onClick={subscriptionHandler}
      className={`
        px-4 py-2 rounded-full font-medium transition cursor-pointer w-fit
        ${isSubscribed
          ? "bg-slate-700 text-stone-400"
          : "bg-white text-black"}
        ${
          subLoading
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-slate-500 hover:text-stone-200"
        }
      `}
    >
      {subLoading
        ? "Processing..."
        : isSubscribed
        ? "Subscribed"
        : "Subscribe"}
    </button>
  )
}

export default SubscribeButton