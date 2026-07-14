import api from "./axios";

export const getUserPlaylists = async(userId, page=1) => {
  const res = await api.get(`playlists/user/${userId}?page=${page}&limit=10`);
  return res.data.data
}

export const getPlaylistById = async(playlistId) => {
  const res = await api.get(`playlists/${playlistId}`);
  return res.data.data
}

export const createPlaylist = async ({ name, description }) => {
  const res = await api.post(`/playlists`, { name, description });
  return res.data.data;
};

export const updatePlaylist = async (playlistId, { name, description }) => {
  const res = await api.patch(`/playlists/${playlistId}`, { name, description });
  return res.data.data;
};

export const deletePlaylist = async (playlistId) => {
  const res = await api.delete(`/playlists/${playlistId}`);
  return res.data.data;
};

export const addVideoToPlaylist = async ({ videoId, playlistId }) => {
  const res = await api.patch(`/playlists/add/${videoId}/${playlistId}`);
  return res.data.data;
};

export const removeVideoFromPlaylist = async ({ videoId, playlistId }) => {
  const res = await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
  return res.data.data;
};