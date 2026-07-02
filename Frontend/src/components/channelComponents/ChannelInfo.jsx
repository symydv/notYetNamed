import React from 'react'
import { useState } from 'react'
import { getAvatarUrl } from '../../utils/cloudinary'
import SubscribeButton from '../SubscribeButton'
import DescriptionBox from './DescriptionBox'
function ChannelInfo({channel, username, user}) {
  const [descriptionBox, setDescriptionBox] = useState(false)
  return (
    <div className='max-h-full p-1 sm:p-2 md:p-3 lg:p-4 flex flex-row'>
      <img
        src={getAvatarUrl(channel.avatar || `https://ui-avatars.com/api/?name=${username}&background=0f172a&color=ffffff`)}
        className="size-15 sm:size-24 md:size-28 lg:size-32 rounded-full border border-gray-700 object-cover mr-2"
      />
      <div className='flex flex-col'>
        <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white'>{channel.fullName}</h1>
        <p className='text-slate-100 text-sm'>@{username}</p>
        <div className = 'flex flex-row gap-1'>
          <p className='text-gray-400 text-sm'>{channel.subscribers} subscribers •</p>
          <p className='text-gray-400 text-sm'>{channel.totalVideos} videos</p>  
        </div>
        {channel.description ? (
          <div className='flex flex-row'>
            <p className='text-sm text-gray-400 line-clamp-1 w-1/3'>{channel.description}</p>
            <button onClick={()=>setDescriptionBox(true)} className='text-white text-sm cursor-pointer hover:text-slate-300'>more</button>
          </div>
        ) : user.username === username ? (
          <p onClick={()=>setDescriptionBox(true)} className='text-sm text-gray-400 flex cursor-pointer hover:text-slate-300'>Add a description</p>
          
        ) : (
          <p className='text-sm text-gray-400'>No description</p>
        )}
        <div className='relative mt-1'>
          <SubscribeButton channel={channel} initialSubscribed={channel.isSubscribed}/>
        </div>
      </div>

      {descriptionBox && (
        <div className="fixed inset-0 z-50 flex justify-center p-20">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDescriptionBox(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-100 bg-[#1a1a1a] rounded-2xl p-3">
            <DescriptionBox channel={channel} setDescriptionBox={setDescriptionBox}/>
          </div>

        </div>
      )}
    </div>
  )
}

export default ChannelInfo