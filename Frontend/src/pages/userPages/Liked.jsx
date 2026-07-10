import { useEffect, useRef, useState} from "react";
import { LoaderCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLikedVideos } from "../../hooks/queries/useLikedVideos"
import {shareAction} from "../../hooks/useVideoActions";
import VideoCardVertical from "../../components/videoComponents/VideoCardVertical";

function Liked() {
  const [openMenuId, setOpenMenuId] = useState(false);
  const toggleMenu = (videoId) => setOpenMenuId(videoId === openMenuId ? false : videoId);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useLikedVideos();

  const videos = data?.pages.flatMap((page) => page.videos) ?? []; 

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && hasNextPage && !isFetchingNextPage){
        fetchNextPage();
      }
    },
    {
      rootMargin: "400px",
    });

    if(loaderRef.current){
      console.log("observed");
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const totalLikedVideos = data?.pages[0]?.totalLikedVideos ?? 0;
  if(isLoading) return <LoadingSpinner/>
  return (
    <div className="text-white min-h-screen px-8 py-6">
      {/* Header */}
      <div className="mb-8 max-w-6xl bg-linear-to-r bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 px-6 py-4 rounded-2xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Liked videos
        </h1>
        <p className="text-zinc-400 mt-2">
          {totalLikedVideos} {videos.length === 1 ? "video" : "videos"}
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="flex h-[65vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">
              No liked videos
            </h2>
            <p className="text-zinc-400 text-lg">
              Videos you like will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl">
          <div className="flex flex-col gap-3">
            {videos.map((video) => (
              <div
                key={video._id}
                className="rounded-2xl transition-all duration-200 hover:bg-zinc-900"
              >
                <VideoCardVertical
                  video={video}
                  vertical={false}
                  showOwner={true}
                  actions={[
                    shareAction(video),
                  ]}
                  isMenuOpen={openMenuId === video._id}
                  onToggleMenu={toggleMenu}
                />
              </div>
            ))}

            {/* Infinite Scroll Loader */}
            <div
              ref={loaderRef}
              className="flex h-16 items-center justify-center"
            >
              {isFetchingNextPage && (
                <LoaderCircle className="size-6 animate-spin text-zinc-400" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Liked