import { Outlet } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'
import { Toaster } from "react-hot-toast"; //used for messaging on p

function App() {

  return (
    < >
      <Toaster position="top-center" />
      <Header/>
      {/* Push content below fixed header */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  )
}

export default App
