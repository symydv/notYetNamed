import React from 'react'
import { getAvatarUrl } from '../../utils/cloudinary'
function ChannelInfo({channel, username}) {
  return (
    <div className='max-h-full p-1 sm:p-2 md:p-3 lg:p-4 flex flex-row'>
      <img
        src={getAvatarUrl(channel.avatar || `https://ui-avatars.com/api/?name=${username}&background=0f172a&color=ffffff`)}
        className="md:size-22 lg:size-32 rounded-full border border-gray-700 object-cover mr-2"
      />
      <div className='flex flex-col'>
        <h1 className='text-3xl font-semibold text-white'>{channel.fullName}</h1>
        <p className='text-slate-100 text-sm'>@{username}</p>
        <div className = 'flex flex-row gap-1'>
          <p className='text-gray-400 text-sm'>{channel.subscribers} subscribers •</p>
          <p className='text-gray-400 text-sm'>{channel.totalVideos} videos</p>  
        </div>
        <div className='flex flex-row'>
          <p className='text-sm text-gray-400 line-clamp-1 w-1/3'>{channel.description}</p>
          <button className='text-white text-sm cursor-pointer hover:text-slate-300'>more</button>
        </div>
        
      </div>
    </div>
  )
}

export default ChannelInfo