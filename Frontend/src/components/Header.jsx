import React, {useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getAvatarUrl } from "../utils/cloudinary.js";
import {MdOutlineAddCircle} from 'react-icons/md'
import {X} from 'lucide-react'
import UserMenu from "./accountComponents/UserMenu.jsx";

function Header() {
  const [search, setSearch] = useState("")
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate()
  const location = useLocation();

  const handleSubmit = (e)=>{
    e.preventDefault()   

    if(!search.trim()){
      navigate('/')
      return;
    } 

    //navigate to home with search query (our backend supports)
    navigate(`/?search=${encodeURIComponent(search)}`)

  }

  const {user, logout} = useAuth()

  const goToLogin = (e)=>{
    e.preventDefault()
    navigate("/login",{state: {from:location}})
  }

  const goToSignUp = (e)=>{
    e.preventDefault()
    navigate("/signup")
  }

  const logoutHandler = async()=>{
    // e.preventDefault() //we need preventDefault only for forms and links (Preventing form submission, Preventing anchor navigation, Preventing page reload)
    await logout()
    setShowLogoutModal(false)
    navigate("/")
  }
  
  const goHome = async(e) =>{
    e.preventDefault();
    navigate("/")
  }



  return (
    <div className="fixed top-0 left-0 h-16 w-full py-2 bg-zinc-900  z-50">
      
      <div className="relative flex items-center px-4">
        
        {/* Left */}
        <div className="font-bold text-white cursor-pointer hover:text-stone-300 " onClick={goHome}>
          Header
        </div>

        {/* Center */}
        <form onSubmit={handleSubmit } className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className="w-48 sm:w-64 md:w-80 lg:w-120 sm:flex items-center h-9 border border-gray-700 rounded-full overflow-hidden bg-black text-gray-100 text-sm">

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
              className="h-full px-5 bg-zinc-800 hover:bg-zinc-700 border-l border-zinc-800 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5 text-white"
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

        <div className="ml-auto text-xs sm:text-sm md:text-md">
          {!user ? (
            <button className=" flex px-4 py-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-600">
              <div onClick={goToLogin} className="hover:text-black">Login</div>
              /
              <div onClick={goToSignUp} className="hover:text-black">SignUp</div>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center bg-zinc-800 text-white rounded-2xl gap-0.5 p-1.5 text-sm cursor-pointer hover:bg-zinc-700 border border-zinc-700 " 
                onClick={() => navigate("/upload")}
              >
                Upload
                <MdOutlineAddCircle className=" text-white text-xl hover:text-gray-300"/>
              </div>
              {!showUserMenu? (
                <img
                  loading="lazy"
                  src={getAvatarUrl(user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`)}  //this function is to resize the avatar image for optimization, not neccesary
                  alt="profile"
                  onClick={() =>setShowUserMenu(true)}
                  className="w-10 h-10 rounded-full cursor-pointer border border-zinc-700"
                />
              ):(
                <div className="w-10 h-10 z-50 text-white flex items-center justify-center rounded-full border cursor-pointer border-zinc-700 " onClick={()=> setShowUserMenu(false)}><X/></div>
              )}
              <UserMenu showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} user={user}/>
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

export default Header