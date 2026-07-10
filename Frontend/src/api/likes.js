import api from "./axios"

export const getLikedVideos = async(page=1)=>{
  const res = await api.get(`/likes/videos?page=${page}&limit=10`);
  return res.data.data; // { videos, totalLikedVideos, totalPages, currentPage }
}