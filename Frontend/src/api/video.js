import api from "./axios";

// GET /videos supports page, limit, search, sortBy, sortType, userId (see video.controller.js)
export const getVideos = async ({ pageParam = 1, limit = 12, excludeId, search } = {}) => {
  const res = await api.get("/videos", {
    params: { page: pageParam, limit, search },
  });

  // normalize into the shape our useInfiniteQuery hooks expect (currentPage/totalPages),
  // and optionally exclude a specific video for sidebar on watch page.
  const videos = excludeId
    ? res.data.data.filter((v) => v._id !== excludeId)
    : res.data.data;

  return {
    videos,
    currentPage: res.data.pagination.page,
    totalPages: res.data.pagination.totalPages,
  };
};

export const getVideoById = async (videoId) => {
  const res = await api.get(`/videos/${videoId}`);
  return res.data.data; // { video, isLiked, isSubscribed }
};