import { useState} from "react"
import { Trash2, MoreVertical } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import VideoCardVertical from "../../components/videoComponents/VideoCardVertical";
import VideoGrid from "../../components/videoComponents/VideoGrid";
import {shareAction, removeFromHistoryAction} from "../../hooks/useVideoActions.jsx";
import { useHistory } from "../../hooks/queries/useHistory.js";
import { useDeleteHistory } from "../../hooks/mutations/useDeleteHistory.js";
import { useRemoveFromHistory } from "../../hooks/mutations/useRemoveFromHistory.js";

function History() {
  const {data:videos = [], isLoading} = useHistory();
  const deleteHistoryMutation = useDeleteHistory();
  const removeFromHistoryMutation = useRemoveFromHistory();
  const [deleteHistoryModal, setDeleteHistoryModal] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  function getHistoryVideoActions(video){
    return [
      shareAction(video),
      removeFromHistoryAction(video, removeFromHistoryMutation)
    ]
  }

  const handleDeleteHistory = () => {
    deleteHistoryMutation.mutate();
  }
  
  if(isLoading){
    return <LoadingSpinner/>
  }
  return (
    <div className="text-white px-8 py-6">
      <div className="relative mb-8 max-w-6xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-500/80">
              Recently watched
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Watch history
            </h1>
          </div>
 
          <button
            onClick={() => setDeleteHistoryModal(true)}
            className="group flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors cursor-pointer hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="size-4 transition-transform group-hover:-rotate-6" />
            Clear history
          </button>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">
              Your watch history is empty
            </h2>
            <p className="text-zinc-400 text-lg">
              Videos you watch will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 max-w-6xl">
          {/* Videos */}
          <div className="flex flex-col flex-2">
            <div className="gap-2 flex flex-col">
              {videos.map((video) => (
                <div key={video._id}>
                  <VideoCardVertical
                    video={video}
                    vertical={false}
                    showOwner={true}
                    actions={getHistoryVideoActions(video)}
                    isMenuOpen={openMenuId === video._id}
                    onToggleMenu={toggleMenu}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {deleteHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-zinc-800 p-6 shadow-2xl border border-zinc-700">
            <h2 className="text-xl font-semibold">
              Clear watch history?
            </h2>

            <p className="mt-3 text-sm text-zinc-300">
              This will permanently remove all videos from your watch history.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600 transition-colors cursor-pointer"
                onClick={() => setDeleteHistoryModal(false)}
              >
                Cancel
              </button>

              <button
                className="rounded-md bg-red-600 px-4 py-2 hover:bg-red-700 transition-colors cursor-pointer"
                onClick={() => {
                    handleDeleteHistory();
                    setDeleteHistoryModal(false);
                  }
                }
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
);
}

export default History