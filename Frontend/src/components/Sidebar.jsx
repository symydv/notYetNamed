import { NavLink } from "react-router-dom";
import { Home, History, ListVideo, ThumbsUp, User } from "lucide-react";
const links = [
  { to: "/", label: "Home", icon: Home },
  // { to: "/you", label: "You", icon: User },
  { to: "/history", label: "History", icon: History },
  { to: "/playlists", label: "Playlists", icon: ListVideo },
  { to: "/liked", label: "Liked", icon: ThumbsUp },
];

function Sidebar() {
  return (
    <>
      {/* Desktop / tablet: fixed left icon rail (hidden on mobile) */}
      <aside className="hidden sm:block fixed top-16 left-0 bottom-0 w-16 bg-transparent z-40">
        <nav className="flex flex-col py-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Icon className="size-5 shrink-0" />
              <span className="leading-tight">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile: fixed bottom tab bar (hidden on sm+) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 z-40 flex">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`
            }
          >
            <Icon className="size-5 shrink-0" />
            <span className="leading-tight">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default Sidebar;