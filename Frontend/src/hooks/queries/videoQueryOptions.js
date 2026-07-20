import { queryOptions } from "@tanstack/react-query";
import { getVideoById } from "../../api/video";

export const videoQueryOptions = (videoId) => {
  return queryOptions({
    queryKey: ["video", videoId],
    queryFn: () => getVideoById(videoId),
    enabled: !!videoId,
  });
};