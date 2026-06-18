import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { getAvatarUrl } from "../utils/cloudinary.js";
import { timeAgo } from "../utils/timeAgo.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";


function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [page, setpage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const navigate = useNavigate()
  const search = searchParams.get("search");
  const loaderRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const [query, setQuery] = useState(search);
  // Fetch videos whenever page or search changes
  useEffect(() => {
    if (isFetching || !hasMore) return;
    console.log(page);
    
    const fetchVideos = async () => {
      setIsFetching(true);
      if (page === 1) setLoading(true);

      try {
        const res = await api.get(`/videos/?page=${page}`, {
          params: search ? { search: query } : {},
        });
        
        setVideos(prev => 
          page === 1
            ? res.data.data
            : [...prev, ...res.data.data]
        );
        setHasMore(page < res.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchVideos();
  }, [page, query]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
          setpage(prev => prev + 1);
        }
      },
      {
        rootMargin: "50%",
        threshold: 0,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching]);

  // Reset when search changes
  const firstFetch = useRef(true); //prevent reset on first fetch
  useEffect(() => {
    if(firstFetch.current){
      firstFetch.current = false;
      return;
    }
    setVideos([]);
    setHasMore(true);
    setIsFetching(false);
    setQuery(search);
    setpage(1);
  }, [search]);

  if (loading && page===1) return <LoadingSpinner/>;

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4.5 p-4">
        {videos.length === 0 && (
          <p className="text-white">No videos found</p>
        )}
        {videos.map((video) => (
          // Link enables native browser actions (open in new tab, copy link, etc.)
          <Link to={`/player/${video._id}`} key={video._id} className="rounded-2xl hover:bg-gray-700 px-1 py-2 relative">
            <div className="relative aspect-video">
              <img
                className="rounded-2xl w-full h-full object-cover pointer-events-none select-none cursor-pointer" //pointer event none to hide image/thumbnail url
                draggable="false"
                src={video.thumbnail}
                alt={video.title}
                loading="lazy" //load the thumbnail only when needed
                decoding="async" // Load and decode the image without blocking page rendering.
              />
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
            <div className="flex relative gap-2 p-1.5">
              <div className=" text-black">
                <div className="top-0 rounded-2xl bg-white  size-8">
                  <img 
                    className="w-8 h-8 rounded-full cursor-pointer"
                    src={getAvatarUrl(video.owner.avatar || `https://ui-avatars.com/api/?name=${video.owner.username}&background=0f172a&color=fff`)} 
                    alt="Profile" 
                  />
                </div>
                
              </div>
              <div>
                <h3 className="text-stone-100 font-semibold ">{video.title}</h3>  {/**make changes to it later. */}
                <h4 className="text-stone-100 font-light">{video.owner.username}</h4>
                <div className="flex gap-1">
                  <h5 className="text-white text-sm">{video.views} views(approx)</h5>
                  <div className="text-white font-extralight"> •</div>
                  <div className="text-white text-sm">{timeAgo(video.createdAt)}</div> {/**timeAgo function created in utils. */}
                </div>  
              </div>
              
            </div>
          </Link >
        ))}
      </div>
      {/* Loader element at the bottom */}
      <div ref={loaderRef} className="h-10"></div>
      {isFetching  && page > 1 && (
        <div className="text-center py-4 text-white">Loading more videos...</div>
      )}
    </>
    
  );
}

export {Home};
