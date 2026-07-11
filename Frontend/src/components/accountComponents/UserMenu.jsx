import { Link } from "react-router-dom"
import { UserCircle, LogOutIcon, TvMinimalPlayIcon} from "lucide-react"
import { getAvatarUrl } from "../../utils/cloudinary"

function UserMenu({showUserMenu, setShowUserMenu, setShowLogoutModal, user}) {
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
              <div className=" border-b border-zinc-700 mb-3"></div>
              <div className="flex flex-col gap-2">

                <Link
                  to={`/you`}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center p-2 hover:bg-zinc-700 rounded-2xl"
                >
                  <UserCircle className="size-5 mr-3" />
                  <span className="text-sm font-semibold">You</span>
                </Link>

                <Link
                  to="/subscriptions"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center p-2 hover:bg-zinc-700 rounded-2xl"
                >
                  <TvMinimalPlayIcon className="size-5 mr-3" />
                  <span className="text-sm font-semibold">Subscriptions</span>
                </Link>

                <button
                  type="button"
                  className="flex items-center w-full p-2 hover:bg-zinc-700 rounded-2xl cursor-pointer"
                  onClick={() =>{
                    setShowUserMenu(false)
                    setShowLogoutModal(true)
                  }}
                >
                  <LogOutIcon className="size-5 mr-3" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default UserMenu