import { useNavigate } from "react-router-dom"
import {Helmet} from "react-helmet-async"
import { Home } from "lucide-react"; 

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-around min-h-screen bg-amber-50">
      <Helmet>
        <title>
          404 Not Found
        </title>
      </Helmet>
      <div className="mb-5 flex flex-col items-center justify-center font-medium">
        <h1 className="text-8xl font-bold text-amber-200 underline font-mono mb-2">404</h1>
        <p >The page you're looking for doesn't exist.</p>
      </div>

      <button 
        onClick={() => navigate("/", { replace: true })}
        className="
          bg-amber-100
          border border-amber-300
          rounded-2xl
          px-5 py-2
          cursor-pointer
          transition-all
          duration-200
          hover:bg-amber-200
          hover:scale-105
        "
      >
        <div className="text-xl font-semibold uppercase hover:tracking-wide flex gap-2 justify-center items-center">
          <Home size={22}/>
          Go Home
        </div>
      </button>
    </div>
  );
}
