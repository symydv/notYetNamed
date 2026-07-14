import { useQuery } from "@tanstack/react-query";
import { playlistsQueryOptions } from "./playlistsQueryOptions";

export const usePlaylists = (userId) => useQuery(playlistsQueryOptions(userId));