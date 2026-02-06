import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { getAvatarUrl } from "../utils/cloudinary";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function Comments({videoId}){
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore]= useState(true);
  const [loading, setLoading] = useState(false);
  const [totalComments, setTotalComments] = useState(0)

  const triggerRef = useRef(null);

  const navigate = useNavigate()
  const location = useLocation(); //used in login to remember the path from where it came from so that we can redirect back to that path after login.
  const {user} = useAuth();
  
  const fetchComments = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    const res = await api.get(`/comments/${videoId}?page=${page}&limit=10`)

    setComments((prev)=> [...prev, ...res.data.data.videoComments])
    setHasMore(res.data.data.hasMore)
    setTotalComments(res.data.data.totalComments);
    setLoading(false)
  },  [page, videoId, hasMore, loading])

  //lazy load first batch
  useEffect(() => {
    if(!triggerRef.current) return;

    const observer = new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        setPage(1)
        observer.disconnect()
      }
    },{rootMargin: "150px"})

    observer.observe(triggerRef.current);

    return ()=>{return observer.disconnect()} //cleanup function
  }, [])

  //fetch comments when page changes
  useEffect(() => {
    if(!hasMore) return;

    fetchComments()
  }, [page, videoId])

  const addComment = async()=>{

  }

  const goToLogin = (e)=>{
    e.preventDefault()
    navigate("/login",{state: {from:location}})
  }

  const likeHandler = async (commentId) => {
    if (!user) {
      toast("sign in to like", { id: "login required" });
      return;
    }

    let prevLiked;
    let prevLikeCount;

    setComments(prev =>
      prev.map(c => {
        if (c._id === commentId) {
          prevLiked = c.isLiked;
          prevLikeCount = c.likeCount;

          return {
            ...c,
            isLiked: !c.isLiked,
            likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1
          };
        }
        return c;
      })
    );

    try {
      await api.post(`/likes/toggle/c/${commentId}`);
    } catch (error) {
      // rollback safely
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? {
                ...c,
                isLiked: prevLiked,
                likeCount: prevLikeCount
              }
            : c
        )
      );
      toast.error("something went wrong");
    }
  };



  return (
  <div className="mt-6 ml-3">
    <h2 className="text-white text-lg font-semibold mb-4">
      {totalComments} {totalComments>1? "Comments":"Comment"}
    </h2>

    <div ref={triggerRef}></div>

    {/*add comment*/}
    {user? (
      <form onSubmit={addComment} className="ml-8 flex p-1">
        <img 
          src={getAvatarUrl(user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`)} 
          alt="user-avatar" 
          className="w-9 h-9"
        />

        <div>
          <input 
            type="text" placeholder="Add comment" id="your comment" 
            className="text-white m-2"
          />
        </div>
      </form>
    ):(
      <div className="ml-8 text-white mb-2">
        <button onClick={goToLogin} className="bg-red-950 p-1 border-0.5 outline-amber-50 outline-1 rounded-2xl">Login</button>
        <span> </span>
        to add comment
      </div>
    )}
    

    {comments.map(c => (
      <div key={c._id} className="mb-4 flex">
        <div>
          <img 
            src= {getAvatarUrl(c.owner.avatar || `https://ui-avatars.com/api/?name=${c.owner.username}&background=0f172a&color=fff`)} 
            alt={c.owner.username}
            className="w-10 h-10 rounded-full flex-shrink-0" 
          />
        </div>
        
        <div className="ml-2.5 flex-1 min-w-0">
          <h1 className="text-blue-400 text-md font-medium">
          {c.owner.username}
        </h1>
        
        <CommentContent content={c.content} />
        
        {/*comment likes */}
        <div className="text-gray-500 ml-2 text-sm flex gap-2 items-center">
          {c.likeCount}
          <button onClick={()=>likeHandler(c._id)} className="cursor-pointer hover:opacity-80 p-1">
            {!c.isLiked ? (
              // NOT LIKED → hollow
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: "scaleX(-1)" }}
              >
                <path d="M1 21h4V9H1v12z" />
                <path d="M23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            ) : (
              // LIKED → filled white
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={{ transform: "scaleX(-1)" }}
                >
                  <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
            )}
          </button>
        </div>
        </div>
      </div>
    ))}

    {loading && (
      <p className="text-stone-400 text-sm">Loading comments…</p>
    )}

    {hasMore && !loading && (
      <button
        onClick={() => setPage(p => p + 1)}
        className="text-sm text-stone-300 hover:text-white"
      >
        Load more
      </button>
    )}
  </div>
  )
}

//comment content logic

const CommentContent = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setShowMore(isOverflowing);
    }
  }, [content]);

  return (
    <div>
      <p
        ref={textRef}
        className={`text-gray-300 text-md font-normal leading-relaxed break-words overflow-wrap-anywhere ${
          !expanded ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </p>

      {showMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-gray-400 hover:text-white text-sm"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default Comments;