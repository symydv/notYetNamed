import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import VideoCard from "../components/videoComponents/VideoCard.jsx";
import VideoGrid from "../components/videoComponents/VideoGrid.jsx";
import {LoaderCircle } from "lucide-react";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [page, setpage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const search = searchParams.get("search");
  const loaderRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const [query, setQuery] = useState(search);
  // Fetch videos whenever page or search changes
  useEffect(() => {
    if (isFetching || !hasMore) return;
    // console.log(page);
    
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

      <VideoGrid videos={videos}/>

      {/* Loader element at the bottom */}
      <div ref={loaderRef} className="h-10"></div>
      {isFetching  && page > 1 && (
        <div className="flex items-center justify-center py-4 text-white"><LoaderCircle className="animate-spin"/></div>
      )}
    </>
    
  );
}

export {Home};
