import { useInfiniteQuery } from "@tanstack/react-query";
import { recommendedVideosQueryOptions } from "./recommendedVideosQueryOptions";

export const useRecommendedVideos = (currentVideoId) =>
  useInfiniteQuery(recommendedVideosQueryOptions(currentVideoId));