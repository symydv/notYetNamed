import { Share2, Trash2, ListPlus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export function shareAction(video) {
  return {
    icon: <Share2 className="size-5" />,
    label: "Share",
    onClick: () => {
      navigator.clipboard.writeText(`${window.location.origin}/player/${video._id}`);
      toast.success("Link copied to clipboard");
    },
  };
}

export function addToPlaylistAction(video, onOpenPlaylistModal) {
  return {
    icon: <ListPlus className="size-5" />,
    label: "Save to playlist",
    onClick: () => onOpenPlaylistModal(video),
  };
}

export function removeFromHistoryAction(video, onRemoved) {
  return {
    icon: <Trash2 className="size-5" />,
    label: "Remove from history",
    danger: true,
    onClick: async () => {
      try {
        await api.patch(`/users/history/remove/${video._id}`);
        toast.success("Removed from history");
        onRemoved?.(video._id);
      } catch{
        toast.error("Couldn't remove video");
      }
    },
  };
}