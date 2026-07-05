import { getAvatarUrl } from "../../utils/cloudinary"
import { Link } from "react-router-dom"

function UserMenu({showUserMenu, setShowUserMenu, user}) {
  return (
    <div>
      {showUserMenu && (
        <div className="fixed inset-0 z-40">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/5"
            onClick={() => setShowUserMenu(false)}
          />

          {/* User Modal */}
          <div className="absolute right-4 top-16 z-50 w-72 bg-gray-900 text-white rounded-2xl p-4 border border-zinc-700">
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2 text-white">
                <img
                  loading="lazy"
                  src={getAvatarUrl(user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`)}  //this function is to resize the avatar image for optimization, not neccesary
                  alt="profile"
                  onClick={() =>setShowUserMenu(true)}
                  className="w-10 h-10 rounded-full border border-zinc-700"
                />
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                  <Link 
                    to={`/channel/${user.username}`} 
                    onClick={() => setShowUserMenu(false)} 
                    className="text-xs text-blue-400">View your channel
                  </Link>
                </div>
              </div>
              <div className=" border-b border-zinc-700"></div>
              <div>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu