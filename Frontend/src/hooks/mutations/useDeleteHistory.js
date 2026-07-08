import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteHistory } from "../../api/history";
import { historyQueryOptions } from "../queries/historyQueryOptions";

export const useDeleteHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHistory,
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: historyQueryOptions().queryKey
      });

      toast.success("History deleted")
    },

    onError: () => {
      toast.error("Something went wrong")
    }

  })
}