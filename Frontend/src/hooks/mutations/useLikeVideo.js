import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { videoQueryOptions } from "../queries/videoQueryOptions";
import { likeVideo } from "../../api/likes";

export const useLikeVideo = (videoId) => {
  const queryClient = useQueryClient();
  const queryKey = videoQueryOptions(videoId).queryKey;

  return useMutation({
    mutationFn: () => likeVideo(videoId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        isLiked: !old.isLiked,
        video: {
          ...old.video,
          likeCount: old.video.likeCount + (old.isLiked ? -1 : 1),
        },
      }));

      return { previous };
    },

    onError: (err, _vars, context) => {
      queryClient.setQueryData(queryKey, context.previous);
      toast.error("Something went wrong");
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};