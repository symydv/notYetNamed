import React from 'react'
import { Loader } from 'lucide-react'
function Button({loading=false, children, className="", ...props}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 transition cursor-pointer ${className}`}
    >
      {loading ? <Loader className = "mx-auto animate-spin"/> : children}
    </button>
  )
}

export default Button