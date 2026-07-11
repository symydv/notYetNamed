import { Share2, Trash2, ListPlus } from "lucide-react";
import toast from "react-hot-toast";

export function shareAction(video) {
  return {
    icon: <Share2 className="size-4" />,
    label: "Share",
    onClick: () => {
      navigator.clipboard.writeText(`${window.location.origin}/player/${video._id}`);
      toast.success("Link copied to clipboard");
    },
  };
}

export function addToPlaylistAction(video, onOpenPlaylistModal) {
  return {
    icon: <ListPlus className="size-4" />,
    label: "Save to playlist",
    onClick: () => onOpenPlaylistModal(video),
  };
}

export function removeFromHistoryAction(video, removeMutation) {
  return {
    icon: <Trash2 className="size-4" />,
    label: "Remove from history",
    danger: true,
    onClick: () => {
      removeMutation.mutate(video._id)
    },
  };
}