import { useInfiniteQuery } from "@tanstack/react-query";
import { videosQueryOptions } from "./videosQueryOptions";

export const useVideos = (search) => useInfiniteQuery(videosQueryOptions(search));