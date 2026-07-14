import { useMemo } from "react";
function ChannelBanner({coverImage, username}) {

  //to get random colors for cover according to username.
  const gradient = useMemo(() => {
      const gradients = [
        "from-zinc-900 to-amber-600/50",
        "from-zinc-900 to-rose-600/50",
        "from-zinc-900 to-teal-600/50",
        "from-zinc-900 to-indigo-600/50",
        "from-zinc-900 to-emerald-600/50",
        "from-zinc-900 to-sky-600/50",
        "from-zinc-900 to-violet-600/50",
        "from-zinc-900 to-orange-600/50",
        "from-slate-900 to-amber-500/40",
        "from-slate-900 to-rose-500/40",
        "from-slate-900 to-teal-500/40",
        "from-slate-900 to-indigo-500/40",
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