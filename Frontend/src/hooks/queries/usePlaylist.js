import { useQuery } from "@tanstack/react-query";
import { playlistQueryOptions } from "./playlistQueryOptions";

export const usePlaylist = (playlistId) => useQuery(playlistQueryOptions(playlistId));