import React from 'react'

const tabs = ["Videos", "Playlists", "Posts"];

function ChannelTabs({ currentTab, setCurrentTab }) {
  return (
    <div className="max-h-full mb-2 mt-4 flex border-b border-zinc-700 justify-around w-1/2 text-sm font-semibold text-zinc-300">
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          tab={tab}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      ))}
    </div>
  );
}

function TabButton({ tab, currentTab, setCurrentTab }) {
  const active = tab === currentTab;

  return (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`cursor-pointer ${active ? "text-white underline underline-offset-5" : "text-zinc-400 hover:text-zinc-300 hover:underline hover:underline-offset-5"} `}
    >
      {tab}
    </button>
  );
}
export default ChannelTabs