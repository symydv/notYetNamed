import toast from "react-hot-toast";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { historyQueryOptions } from "../queries/historyQueryOptions";
import { removeFromHistory } from "../../api/history";

export const useRemoveFromHistory = () => {
  const queryClient = useQueryClient();
  const queryKey = historyQueryOptions().queryKey;

  return useMutation({
    mutationFn: removeFromHistory,

    onMutate: async(videoId) => {
      await queryClient.cancelQueries({queryKey}); //handlle double clicks and all during mutation/on going api call.

      const prevHistory = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old) => {
        old?.filter((video) => video._id !== videoId);
      })

      return {prevHistory};
    },

    onError: (err, videoId, context)=>{
      queryClient.setQueryData(queryKey, context.previousHistory);
      toast.error("Something went wrong")
    },

    onSuccess: ()=>{
      toast.success("Video removed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({queryKey})
    }
  })
}