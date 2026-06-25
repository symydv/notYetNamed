
function Input({icon:Icon, ...props}){
  return <div className="relative mb-6">
    <div className="absolute flex inset-y-0 left-0 items-center pl-2 pointer-events-none">
      <Icon className="size-5"/>
    </div>
    <input {...props} className="w-full pl-10 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"/>
  </div>
}

export default Input