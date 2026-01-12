import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/cloudinary.js";

function Header() {
  const [search, setSearch] = useState("")
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()   

    if(!search.trim()) return;

    //navigate to home with search query (our backend supports)
    navigate(`/?search=${encodeURIComponent(search)}`)

  }

  const {user, loading, logout} = useAuth()

  const goToLogin = (e)=>{
    e.preventDefault()
    navigate("/login")
  }

  const goToSignUp = (e)=>{
    e.preventDefault()
    navigate("/signup")
  }

  const logoutHandler = async(e)=>{
    // e.preventDefault() //we need preventDefault only for forms and links (Preventing form submission, Preventing anchor navigation, Preventing page reload)
    await logout()
    setShowLogoutModal(false)
  }



  return (
    <div className="fixed top-0 left-0 w-full py-4 bg-gray-500 z-50">
      
      <div className="relative flex items-center px-4">
        
        {/* Left */}
        <div className="font-bold text-white">
          Header
        </div>

        {/* Center */}
        
        <form onSubmit={handleSubmit } className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="flex items-center h-10 border border-gray-500 rounded-full overflow-hidden bg-gray-300">

            <input
              type="text"
              placeholder="Search"
              id="video-title"
              className="h-full w-150 px-4 outline-none bg-transparent"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="h-full px-5 bg-white hover:bg-gray-300 border-l border-gray-400"
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
          {!user ? (
            <button className="flex px-4 py-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-600">
              <div onClick={goToLogin} className="hover:text-black">Login</div>
              /
              <div onClick={goToSignUp} className="hover:text-black">SignUp</div>
            </button>
          ) : (
            <div className="flex gap-1">
              <img
                loading="lazy"
                src={getAvatarUrl(user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`)}  //this function is to resize the avatar image for optimization, not neccesary
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <button className="bg-gray-700 text-white rounded-2xl p-1 hover:bg-gray-600 cursor-pointer" onClick={()=> setShowLogoutModal(true)}>Logout</button>
            </div>
            
          )}
        </div>
      </div>

        {/* for logout conformation */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-zinc-900 text-white rounded-xl p-6 w-80 z-10">
            <h2 className="text-lg font-semibold mb-2">Log out?</h2>
            <p className="text-sm text-gray-400 mb-4">
              सही में?!!
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1 rounded-lg bg-gray-700 hover:bg-gray-600"
                onClick={() => setShowLogoutModal(false)}
              >
                नहीं रे.
              </button>

              <button
                className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700"
                onClick={logoutHandler}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Header };
