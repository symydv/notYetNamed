import { useQueryClient, useMutation } from "@tanstack/react-query";
import { historyQueryOptions } from "../queries/historyQueryOptions";
import { addToHistory } from "../../api/history";

export const useAddToHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToHistory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: historyQueryOptions().queryKey
      });
    }
  })
}