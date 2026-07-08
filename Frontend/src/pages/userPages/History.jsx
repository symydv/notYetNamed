import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react"
import api from "../../api/axios"
import { Trash2, MoreVertical } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import VideoCardVertical from "../../components/videoComponents/VideoCardVertical";
import VideoGrid from "../../components/videoComponents/VideoGrid";
import toast from "react-hot-toast";
import {shareAction, removeFromHistoryAction} from "../../hooks/useVideoActions.jsx";
import { useHistory } from "../../hooks/queries/useHistory.js";
import { useDeleteHistory } from "../../hooks/mutations/useDeleteHistory.js";

function History() {
  const {data:videos = [], isLoading} = useHistory();
  const deleteHistoryMutation = useDeleteHistory();
  const {user} = useAuth();
  const [deleteHistoryModal, setDeleteHistoryModal] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleDeleteHistory = () => {
    deleteHistoryMutation.mutate();
  }
  
  if(isLoading){
    return <LoadingSpinner/>
  }
  return (
    <div className="text-white p-4 pl-20">
      <div className="text-3xl font-bold mb-10">
        Watch history
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
        <div className="flex gap-4">
          {/* Videos */}
          <div className="flex flex-col flex-2">
            <div className="gap-2 flex flex-col">
              {videos.map((video) => (
                <div key={video._id}>
                  <VideoCardVertical
                    video={video}
                    vertical={false}
                    showOwner={true}
                    actions={[
                      shareAction(video), 
                      removeFromHistoryAction(video),
                    ]}
                    isMenuOpen={openMenuId === video._id}
                    onToggleMenu={toggleMenu}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex-1">
            <div className="p-10 text-md items-center font-semibold">
              <div
                className="flex gap-2 items-center hover:bg-zinc-500 rounded-full p-2 w-fit cursor-pointer transition-colors"
                onClick={() => setDeleteHistoryModal(true)}
              >
                <Trash2 className="size-5" />
                Clear watch history
              </div>
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