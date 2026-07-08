import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { historyQueryOptions } from "../queries/historyQueryOptions";
import { removeFromHistory } from "../../api/history";

export const useRemoveFromHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromHistory,

    onSuccess: ()=>{
      queryClient.invalidateQueries({
        queryKey: historyQueryOptions().queryKey,
      })

      toast.success("Video removed");
    },

    onError: ()=>{
      toast.error("Something went wrong")
    },
  })
}