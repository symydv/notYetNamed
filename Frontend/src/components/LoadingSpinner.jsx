import {motion} from "framer-motion"

const LoadingSpinner = () => {
  return (
    <div className = "min-h-screen bg-zink-900 flex justify-center items-center relative overflow-hidden">
      {/* simple loading spinner */}
      <motion.div 
        className="w-16 h-16 border-4 border-t-red-600 rounded-full"
        animate = {{rotate: 360}}
        transition={{duration: 1, repeat: Infinity, ease: "linear"}}
      ></motion.div>
    </div>
  )
}

export default LoadingSpinner