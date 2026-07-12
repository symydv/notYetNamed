// VideoActions.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function VideoActions({ isOpen, onClose, actions, anchorRef}) {
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({top:0, left:0});

  const MENU_WIDTH = 180;  // matches w-45 (45 * 4 = 180px)
  const MENU_HEIGHT = actions?.length * 35;
  useLayoutEffect(() => {
    if(!isOpen || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    
    let left = rect.right - 30;
    if(left<8){
      left = rect.left;
    }
    if(left+MENU_WIDTH > window.innerWidth){
      left = window.innerWidth - MENU_WIDTH - 20;
    }
    let top = rect.bottom + 4;
    if (top + MENU_HEIGHT > window.innerHeight - 8) {
      top = rect.top - MENU_HEIGHT - 4; 
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect 
    setCoords({top, left})
    // -- syncing menu position with the anchor button's real on-screen layout (getBoundingClientRect),
    // an external system React can't read during render. This matches React's own
    // documented useLayoutEffect exception for measuring DOM before paint.
    
  }, [isOpen, anchorRef, MENU_HEIGHT])

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target) && !anchorRef.current?.contains(e.target)) {
        onClose();
      }
    };
    const handleScroll = () => onClose(); // simplest: close on scroll rather than re-tracking position

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    }
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: coords.top, left: coords.left }}
      className="fixed z-50 w-45 rounded-xl text-sm border border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl"
    >
      {actions?.map((action, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick?.();
            onClose();
          }}
          className={`flex w-full items-center gap-3 py-2 px-3 text-xs cursor-pointer transition-colors
            ${action.danger ? "text-red-400 hover:bg-red-500/10" : "text-zinc-100 hover:bg-zinc-700"}`}
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>,
    document.body
  );
}

export default VideoActions;