import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import VideoGrid from "../components/videoComponents/VideoGrid.jsx";
import {LoaderCircle } from "lucide-react";
import { shareAction, addToPlaylistAction } from "../hooks/useVideoActions.jsx";
import { useVideos } from "../hooks/queries/useVideos.js";

function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useVideos(search);
  
  const videos = data?.pages.flatMap((p) => p.videos) ?? [];
  
  const loaderRef = useRef(null);

  function getHomeVideoActions(video) {
    return [
      shareAction(video),
      addToPlaylistAction(video, () => toast("Playlist feature coming soon")),
    ];
  }

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "50%" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  if (isLoading) return <LoadingSpinner/>;

  return (
    <>

      <VideoGrid videos={videos} getActions={getHomeVideoActions}/>

      {/* Loader element at the bottom */}
      <div ref={loaderRef} className="h-10"></div>
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4 text-white"><LoaderCircle className="animate-spin"/></div>
      )}
    </>
    
  );
}

export {Home};
