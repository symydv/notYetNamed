import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const isLoggedIn = false; // later from Redux / Context
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()   

    if(!search.trim()) return;

    //navigate to home with search query (our backend supports)
    navigate(`/?search=${encodeURIComponent(search)}`)

  }

  return (
    <div className="fixed top-0 left-0 w-full py-4 bg-gray-400">
      
      <div className="relative flex items-center px-4">
        
        {/* Left */}
        <div className="font-semibold">
          Header
        </div>

        {/* Center */}
        
        <form onSubmit={handleSubmit } className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="flex items-center h-10 border border-gray-500 rounded-full overflow-hidden bg-white">

            <input
              type="text"
              placeholder="Search"
              id="video-title"
              className="h-full w-96 px-4 outline-none bg-transparent"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="h-full px-5 bg-gray-200 hover:bg-gray-300 border-l border-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </button>

          </div>
        </form>


        <div className="ml-auto">
          {!isLoggedIn ? (
            <button className="px-4 py-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-500">
              Login
            </button>
          ) : (
            <img
              src="https://images.pexels.com/photos/30905185/pexels-photo-30905185.jpeg"
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { Header };
