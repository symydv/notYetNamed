import React from 'react'

const tabs = ["Videos", "Playlists", "Posts"];

function ChannelTabs({ currentTab, setCurrentTab }) {
  return (
    <div className='sticky top-14 z-10 border-b border-zinc-700 backdrop-blur-xl text-zinc-950'>
      <div className="max-h-full  mb-3 flex  justify-start gap-10 w-full text-sm font-semibold text-zinc-300">
        {tabs.map((tab) => (
          <TabButton
            key={tab}
            tab={tab}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        ))}
      </div>
    </div>
  );
}

function TabButton({ tab, currentTab, setCurrentTab }) {
  const active = tab === currentTab;

  return (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`cursor-pointer ${active ? "text-white underline underline-offset-15" : "text-zinc-400 hover:text-zinc-300 hover:underline hover:underline-offset-5"} `}
    >
      {tab}
    </button>
  );
}
export default ChannelTabs