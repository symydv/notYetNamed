import { infiniteQueryOptions } from "@tanstack/react-query";
import { getVideos } from "../../api/video";

export const recommendedVideosQueryOptions = (currentVideoId) => {
  return infiniteQueryOptions({
    queryKey: ["recommended-videos", currentVideoId],
    queryFn: ({ pageParam }) =>
      getVideos({ pageParam, limit: 12, excludeId: currentVideoId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    enabled: !!currentVideoId,
  });
};