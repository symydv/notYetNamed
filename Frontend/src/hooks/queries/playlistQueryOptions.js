import { queryOptions } from "@tanstack/react-query";
import { getPlaylistById } from "../../api/playlist";

export const playlistQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylistById,
    enabled: !!playlistId,
  })
}