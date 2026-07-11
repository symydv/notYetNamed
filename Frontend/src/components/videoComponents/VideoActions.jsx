// VideoActions.jsx
import { useEffect, useRef } from "react";

function VideoActions({ isOpen, onClose, actions }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) onClose();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-1 z-50 w-45 rounded-xl text-sm border border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl"
    >
      {actions.map((action, index) => (
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
    </div>
  );
}

export default VideoActions;