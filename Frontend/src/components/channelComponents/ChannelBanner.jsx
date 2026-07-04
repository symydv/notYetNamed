import { useMemo } from "react";
function ChannelBanner({coverImage, username}) {

  //to get random colors for cover according to username.
  const gradient = useMemo(() => {
      const gradients = [
        "from-slate-800 to-slate-600",
        "from-zinc-900 to-slate-700",
        "from-gray-900 to-gray-700",
        "from-indigo-700 to-blue-500",
        "from-blue-700 to-cyan-500",
        "from-cyan-700 to-teal-500",
        "from-purple-700 to-indigo-500",
        "from-violet-700 to-fuchsia-500",
        "from-fuchsia-700 to-pink-500",
        "from-emerald-700 to-teal-500",
        "from-green-700 to-emerald-500",
        "from-lime-700 to-green-500",
        "from-orange-700 to-amber-500",
        "from-amber-700 to-orange-500",
        "from-red-700 to-orange-500",
        "from-rose-700 to-pink-500",
        "from-red-800 to-rose-500",
        "from-sky-700 to-indigo-500",
        "from-blue-800 to-violet-500",
        "from-teal-800 to-cyan-500",
        "from-emerald-800 to-cyan-500",
        "from-neutral-900 to-zinc-700",
        "from-stone-800 to-slate-600",
        "from-purple-800 to-slate-700",
        "from-indigo-800 to-slate-600",
        "from-indigo-700 via-blue-600 to-cyan-500",
        "from-purple-700 via-fuchsia-600 to-pink-500",
        "from-emerald-700 via-teal-600 to-cyan-500",
        "from-orange-700 via-amber-600 to-yellow-500",
        "from-slate-900 via-slate-700 to-slate-500",
        "from-blue-900 via-indigo-700 to-violet-500",
        "from-red-800 via-rose-700 to-pink-500",
        "from-teal-900 via-cyan-700 to-sky-500",
        "from-zinc-900 via-slate-800 to-gray-600",
        "from-violet-800 via-purple-700 to-fuchsia-500",
      ];
      if (!username) return gradients[0];
  
      let hash = 0;
      for (const char of username.toLowerCase()) {
        hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
      }
  
      return gradients[hash % gradients.length];
    }, [username]);

  return (
    <div className="mb-2">
      <div className='realative max-h-full rounded-xl overflow-hidden border border-zinc-700'>
        {coverImage? (
          <img src={coverImage} alt="Channel Cover" className="w-full h-15 sm:h-20 md:h-30 lg:h-45 object-cover"/>
        ):(
          <div className={`h-15 sm:h-25 md:h-30 lg:h-45 bg-linear-to-r ${gradient} object-cover`} />
        )}
      </div>
    </div>
    
  )
}

export default ChannelBanner