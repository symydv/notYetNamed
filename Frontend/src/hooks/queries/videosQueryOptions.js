import { infiniteQueryOptions } from "@tanstack/react-query";
import { getVideos } from "../../api/video";

export const videosQueryOptions = (search) => {
  return infiniteQueryOptions({
    queryKey: ["videos", search ?? null],
    queryFn: ({ pageParam }) => getVideos({ pageParam, limit: 12, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });
};