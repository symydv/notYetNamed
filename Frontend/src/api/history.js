import api from "./axios";

export const getHistory = async()=>{
  const res = await api.get("/users/history");
  return res.data.data;
}

export const deleteHistory = async()=>{
  const res = await api.delete("/users/history/delete");
  return res.data;
}

export const addToHistory = async(videoId)=>{
  await api.patch(`/users/history/${videoId}`);
}

export const removeFromHistory = async(videoId) => {
  await api.patch(`/users/history/remove/${videoId}`);
}