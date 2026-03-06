import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { getAvatarUrl } from "../../utils/cloudinary";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function Comments({videoId}){
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore]= useState(true);
  const [loading, setLoading] = useState(false);
  const [totalComments, setTotalComments] = useState(0)

  const [newComment, setNewComment] = useState("")
  const [isClicked, setIsClicked] = useState(false)

  const [editingComment, setEditingComment] = useState(null);

  const triggerRef = useRef(null);

  const navigate = useNavigate()
  const location = useLocation(); //used in login to remember the path from where it came from so that we can redirect back to that path after login.
  const {user} = useAuth();
  
  const fetchComments = useCallback(async () => {
    setLoading(prev => {
      if (prev || !hasMore) return prev;
      return true;
    });

    const res = await api.get(`/comments/${videoId}?page=${page}&limit=10`);

    setComments(prev => [...prev, ...res.data.data.videoComments]);
    setHasMore(res.data.data.hasMore);
    setTotalComments(res.data.data.totalComments);
    setLoading(false);
  }, [page, videoId, hasMore]);


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
  }, [page, videoId, fetchComments])

  //add new comment.
  const addComment = async(e)=>{
    e.preventDefault();
    if(isClicked) return;
    if(!newComment.trim()) return;
    if(!user) return;

    try {
      setIsClicked(true)
      const res = await api.post(`/comments/${videoId}`, {content: newComment, videoId: videoId})
      
      setComments(prev => [res.data.data, ...prev]);
      setNewComment("")
      setTotalComments(prev => prev + 1);
    } catch (error) {
      toast.error("something went wrong")
    }finally{
      setIsClicked(false)
    }
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

  //deleting a comment, this function is used in dropBox components which is below in this same file
  const deleteCommentHandler = async (commentId) => {
    const prevComments = comments;

    try {
      setComments(prev => {
        const updated = prev.filter(c => c._id !== commentId);

        // if last comment on page removed, go back a page
        if (updated.length === 0 && page > 1) {
          setPage(p => p - 1);
        }

        return updated;
      });

      setTotalComments(prev => prev - 1);

      await api.delete(`comments/c/${commentId}`);
      toast.success("Comment deleted");
    } catch (error) {
      // rollback
      setComments(prevComments);
      setTotalComments(prev => prev + 1);
      toast.error("Failed to delete comment");
    }
  };

  
  const updateCommentHandler = (commentId) => {
    const comment = comments.find(c => c._id === commentId);
    setEditingComment({ id: commentId, content: comment.content });
  };

  const submitUpdate = async (commentId, newContent) => {
    const prev = comments.find(c => c._id === commentId);
    
    // optimistic update
    setComments(p => p.map(c => c._id === commentId ? { ...c, content: newContent } : c));
    setEditingComment(null);

    try {
      await api.patch(`comments/c/${commentId}`, { newContent: newContent });
      toast.success("Comment updated");
    } catch {
      // rollback
      setComments(p => p.map(c => c._id === commentId ? { ...c, content: prev.content } : c));
      toast.error("Failed to update");
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
      <form onSubmit={addComment} className="ml-8 flex p-1 w-full">
        <img 
          src={getAvatarUrl(user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0f172a&color=fff`)} 
          alt="user-avatar" 
          className="w-9 h-9"
        />

        <div className="flex gap-2 w-full">
          <input 
            type="text" placeholder="Add comment" id="your comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}
            className="text-white m-2"
          />
          <button className="text-gray-800 bg-stone-200 rounded-xl size-min mt-1.5 px-1.5 cursor-pointer"> add </button>
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
            src= {getAvatarUrl(c.owner?.avatar || `https://ui-avatars.com/api/?name=${c.owner?.username}&background=0f172a&color=fff`)} 
            alt={c.owner?.username}
            className="w-10 h-10 rounded-full flex-shrink-0" 
          />
        </div>
        
        <div className="ml-2.5 flex-1 min-w-0">
          <h1 className="text-blue-400 text-md font-medium">
          {c.owner?.username}
        </h1>
        
        <div className="flex justify-between">
          <CommentContent content={c.content} />
          <DropDown 
            user={user} 
            owner={c.owner} 
            id={c._id} 
            deleteCommentHandler={deleteCommentHandler} 
            updateCommentHandler={updateCommentHandler}
          />
        </div>
        
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

    {/* to show a update model when user wants to update a comment */}
    {editingComment && (
      <UpdateModal
        initialContent={editingComment.content}
        onSave={(newContent) => submitUpdate(editingComment.id, newContent)}
        onClose={() => setEditingComment(null)}
      />
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


//drop down box which appears after the comment.
const DropDown = ({ user, owner, id, deleteCommentHandler, updateCommentHandler}) => {
  const [dropBox, setDropBox] = useState(false);
  const dropDownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target)
      ) {
        setDropBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteComment = async () => {
    setDropBox(false);
    deleteCommentHandler(id);
  };

  const updateComment = async()=>{
    setDropBox(false);
    updateCommentHandler(id);
  }
  

  return (
    <div className="relative text-white" ref={dropDownRef}>
      <button
        className="cursor-pointer"
        onClick={() => setDropBox((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </button>

      {dropBox && (
        <div className="absolute right-0 mt-2 z-10 bg-gray-700 rounded-2xl shadow-lg">
          <ul className="p-2 text-sm font-medium">
            {user?._id === owner?._id ? (
              <>
                <li>
                  <button 
                    className="inline-flex w-full p-2 hover:bg-gray-600 rounded cursor-pointer"
                    onClick={updateComment}
                  >
                    Update
                  </button>
                </li>
                <li>
                  <button className="inline-flex w-full p-2 hover:bg-gray-600 rounded cursor-pointer" onClick={deleteComment}>
                    Delete
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button className="inline-flex w-full p-2 hover:bg-gray-600 rounded cursor-pointer">
                  Report
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const UpdateModal = ({ initialContent, onSave, onClose }) => {
  const [text, setText] = useState(initialContent);

  useEffect(() => { // for closing the model on pressing Esc
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-white text-xl font-bold mb-1">Edit Comment</h2>

        <textarea
          className="w-full bg-[#111] text-white rounded-xl p-3 resize-none focus:outline-none text-sm leading-relaxed"
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2e2e2e] text-gray-300 hover:bg-[#3a3a3a] text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (text.trim()) onSave(text.trim()); }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;