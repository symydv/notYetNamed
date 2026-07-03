import React from 'react'
import { PlaySquare, LucideInfo, UserCircle, Eye, PlayCircle, X} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../../api/axios'

function DescriptionBox({channel, setDescriptionBox, user, description, setDescription}) {
  const isOwner = user?.username === channel.username;
  const [editMode, setEditMode] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedDescription, setSavedDescription] = React.useState(description);

  const date = new Date(channel.createdAt);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSaveDescription = async (e) => {
    e.preventDefault();
    if(!isOwner) return;
    if(saving) return;
    if (!description.trim()) {
        toast.error("Description cannot be empty");
        return;
    }
    setSaving(true);
    try {
      const res = await api.patch(`/channel/description/${user?.username}`, {description});
      setDescription(res.data.data.description);
      setSavedDescription(res.data.data.description);
      setEditMode(false);
      toast.success("description updated");
    } catch (error) {
      toast.error("something went wrong");
    }finally{
      setSaving(false);
    }
    
  }
  return (
    <div className='w-full max-w-lg text-white flex flex-col p-2'>
      <div className='flex justify-between'>
        <h1 className='font-bold mb-8 '>{channel.fullName}</h1>

        <button 
          onClick={()=>{
            setDescriptionBox(false)
          }} 
          className='flex justify-start cursor-pointer '
        >
          <X className='hover:bg-zinc-800'/>
        </button>

      </div>
      
      <div className="border border-zinc-700 rounded-xl min-h-20 mb-4 p-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Description</h2>
          
          {isOwner && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-500 text-sm hover:underline cursor-pointer"
            >
              {description ? "Edit" : "Add"}
            </button>
          )}
        </div>

        {editMode ? (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border border-zinc-600 rounded-md p-2 outline-none"
              rows={4}
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveDescription}
                disabled={saving}
                className="px-3 py-1 bg-blue-600 rounded-md disabled:bg-blue-500 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setEditMode(false);
                  setDescription(savedDescription);
                }}
                className="px-3 py-1 bg-zinc-700 rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm">
            {description || (
              isOwner
                ? "No description. Click 'Add' to add one."
                : "No description available."
            )}
          </p>
        )}

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