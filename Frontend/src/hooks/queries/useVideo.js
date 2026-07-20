import { useQuery } from "@tanstack/react-query";
import { videoQueryOptions } from "./videoQueryOptions";

export const useVideo = (videoId) => useQuery(videoQueryOptions(videoId));