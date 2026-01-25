import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { getAvatarUrl } from "../utils/cloudinary";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";


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
        <p className="text-white text-md font-normal leading-relaxed break-words overflow-wrap-anywhere">
          {c.content}
        </p>
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

export default Comments;