import React from 'react'
import { PlaySquare, LucideInfo, UserCircle, Eye, PlayCircle, X} from 'lucide-react'
import { Link } from 'react-router-dom'
function DescriptionBox({channel, setDescriptionBox}) {
  const date = new Date(channel.createdAt);

  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className='w-full max-w-lg text-white flex flex-col p-2'>
      <div className='flex justify-between'>
        <h1 className='font-bold mb-8 '>{channel.fullName}</h1>
        <button onClick={()=>setDescriptionBox(false)} className='flex justify-start cursor-pointer '><X className='hover:bg-zinc-800'/></button>
      </div>
      
      <div className=' border border-zinc-700 rounded-xl min-h-20 mb-4 p-1'>
        <h2 className='font-semibold mb-2 m-1'>Description</h2>
        <p className='text-sm m-1'>{channel.description}</p>
      </div>
      
      <h2 className='font-semibold mb-2'>More info</h2>
      <Info icon={PlayCircle} info={<div>www.Tapes/@{channel.username}</div>}/>
      <Info icon={LucideInfo} info={"Joined " + formatted}/>
      <Info icon={UserCircle} info={channel.subscribers + " subscribers"}/>
      <Info icon={Eye} info={channel.views + " views"}/>
      <Info icon={PlaySquare} info={channel.totalVideos + " videos"}/>
    </div>
  )
}

function Info({icon:Icon, info}){
  return (
    <div className='flex flex-row items-center gap-2 mb-4'>
      <Icon className='size-5'/>
      <div className='text-sm text-gray-200'>{info}</div>
    </div>
  )
}

export default DescriptionBox