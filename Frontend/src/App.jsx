import { Outlet } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'

function App() {

  return (
    < >
      <Header/>
      {/* Push content below fixed header */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  )
}

export default App
