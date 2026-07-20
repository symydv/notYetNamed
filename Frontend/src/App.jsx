import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react';
import Header from './components/Header'
import { Toaster } from "react-hot-toast"; //used for messaging on p
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

function App() {
  const { pathname } = useLocation();
  const {user} = useAuth();

  const showSidebar = user && !pathname.startsWith("/player");
  //scroll restoration
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);
  
  return (
    <>
      <Toaster position="top-center" />
      <Header/>
      <div className={`pt-16 min-h-screen bg-linear-to-b from-zinc-900 via-zinc-950 to-black ${showSidebar ? "pb-16 sm:pb-0 sm:pl-16" : ""}`}>
        {showSidebar && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App