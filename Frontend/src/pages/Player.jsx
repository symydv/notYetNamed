import { useRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import api from "../api/axios.js";
import { getAvatarUrl, getThumbnailUrl } from "../utils/cloudinary.js";
import { useAuth } from "../context/AuthContext.jsx";
import Comments from "../features/Comments.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SubscribeButton from "../components/SubscribeButton.jsx";
import { useAddToHistory } from "../hooks/mutations/useAddToHistory.js";
import { useVideo } from "../hooks/queries/useVideo.js";
import { useLikeVideo } from "../hooks/mutations/useLikeVideo.js";
import { useRecommendedVideos } from "../hooks/queries/useRecommendedVideos.js";
import { timeAgo } from "../utils/timeAgo.js";

function Player() {
  const { videoId } = useParams();
  const { user } = useAuth();

  const addToHistoryMutation = useAddToHistory();
  const likeMutation = useLikeVideo(videoId);

  const { data, isLoading: loading, isError } = useVideo(videoId);
  const video = data?.video;
  const isLiked = data?.isLiked;
  const isSubscribed = data?.isSubscribed;

  const {
    data: recData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: recLoading,
  } = useRecommendedVideos(videoId);

  const recommended = recData?.pages.flatMap((p) => p.videos) ?? [];

  // --- infinite scroll sentinel ---
  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);

  const viewSentRef = useRef(false);

  async function played(videoId) {
    if (viewSentRef.current) return;
    viewSentRef.current = true;

    try {
      await api.post(`/videos/${videoId}/view`);
      if (user) {
        addToHistoryMutation.mutate(videoId);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!descRef.current) return;
    const el = descRef.current;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [video?.description]);

  const likeHandler = () => {
    if (!user) {
      toast("Sign in to like", { id: "login required" });
      return;
    }
    likeMutation.mutate();
  };

  if (loading) return <LoadingSpinner />;

  if (isError || !video) {
    return (
      <div className="w-full py-24 text-center text-white">
        <p className="text-xl font-semibold">Video not found</p>
        <p className="text-zinc-400 text-sm mt-2">
          This video may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-450 mx-auto px-3 sm:px-6 py-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Helmet>
        <title>{video.title} - Tapes</title>
      </Helmet>

      <div className="w-full col-span-1 lg:col-span-2">
        {/* Video */}
        <div className="aspect-video bg-black rounded-2xl overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-full object-contain block"
            preload="metadata"
            controlsList="nodownload"
            onPlay={() => played(videoId)}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-white text-xl font-semibold leading-snug">
          {video.title}
        </h1>

        {/* Views + Time */}
        <div className="mt-1 flex items-center gap-2 text-sm text-stone-400">
          <span>{video.views.toLocaleString()} views</span>
          <span>•</span>
          <span>
            {new Date(video.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Channel + Actions */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={getAvatarUrl(
                  video.owner.avatar ||
                    `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`
                )}
                alt={video.owner.username}
                className="w-full h-full object-cover block"
              />
            </div>

            <div>
              <Link
                className="text-stone-100 font-medium leading-tight cursor-pointer"
                to={`/channel/${video.owner.username}`}
              >
                {video.owner.username}
              </Link>
              <div className="text-stone-400 text-sm">
                {video.owner.subscriberCount} subscribers
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={likeMutation.isPending}
              onClick={likeHandler}
              aria-label={isLiked ? "Unlike this video" : "Like this video"}
              className={`flex items-center gap-2 px-4 py-2 rounded-full
                bg-stone-800 text-white hover:bg-stone-700
                transition-all duration-200 cursor-pointer active:scale-95
                ${likeMutation.isPending ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-white" : "fill-none"}`}
              />
              <span className="text-sm font-medium">{video.likeCount}</span>
            </button>

            <SubscribeButton channel={video.owner} initialSubscribed={isSubscribed} />
          </div>
        </div>

        {/* Description */}
        <div className="mt-5 w-full bg-gray-800 rounded-2xl p-4">
          <h1 className="font-semibold text-white">Description</h1>
          <p
            ref={descRef}
            className={`text-white text-sm leading-relaxed whitespace-pre-wrap wrap-break-word transition-all duration-200
              ${expanded ? "" : "line-clamp-2 md:line-clamp-3"}`}
          >
            {video.description}
          </p>

          {isOverflowing && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm font-medium text-stone-300 hover:text-white"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <Comments videoId={videoId} />
      </div>

      <div className="w-full mt-6 lg:mt-0 col-span-1">
        <h2 className="text-white font-semibold mb-3 px-1">Up next</h2>

        <div className="flex flex-col gap-2">
          {recLoading && <p className="text-stone-400 text-sm px-1">Loading...</p>}

          {!recLoading && recommended.length === 0 && (
            <p className="text-stone-400 text-sm px-1">No more videos to show</p>
          )}

          {recommended.map((rec) => (
            <Link
              key={rec._id}
              to={`/player/${rec._id}`}
              className="flex gap-2 rounded-xl hover:bg-zinc-800 p-1.5"
            >
              <div className="relative w-40 shrink-0 aspect-video">
                <img
                  src={getThumbnailUrl(rec.thumbnail)}
                  alt={rec.title}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className="rounded-xl w-full h-full object-cover pointer-events-none select-none"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-stone-100 text-sm font-semibold line-clamp-2">
                  {rec.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-1">{rec.owner?.fullName}</p>
                <p className="text-zinc-400 text-xs">
                  {rec.views} views • {timeAgo(rec.createdAt)}
                </p>
              </div>
            </Link>
          ))}

          <div ref={sentinelRef} className="h-1" />

          {isFetchingNextPage && (
            <p className="text-stone-400 text-sm px-1 text-center py-2">Loading more...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { Player };