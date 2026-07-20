import api from "./axios"

export const getLikedVideos = async(page=1)=>{
  const res = await api.get(`/likes/videos?page=${page}&limit=10`);
  return res.data.data; // { videos, totalLikedVideos, totalPages, currentPage }
}

export const likeVideo = async(videoId)=>{
  const res = await api.post(`/likes/toggle/v/${videoId}`);
  return res.data.data;
}