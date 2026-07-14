import { useQueryClient, useMutation } from "@tanstack/react-query";
import { playlistsQueryOptions } from "../queries/playlistsQueryOptions";
import { addVideoToPlaylist } from "../../api/playlist";
import toast from "react-hot-toast";

export const useAddVideoToPlaylist = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVideoToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: playlistsQueryOptions(userId).queryKey, 
      })
      toast.success("Video added to playlist")
    },

    onError: () => {
      toast.error("Something went wrong")
    }
  })
}