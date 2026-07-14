import { queryOptions } from "@tanstack/react-query";
import { getUserPlaylists } from "../../api/playlist";

export const playlistsQueryOptions = (userId) => {
  return queryOptions({
    queryKey: ["playlists", userId],
    queryFn: () => getUserPlaylists(userId),
    enabled: !!userId
  })
}