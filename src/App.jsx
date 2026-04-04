import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Register from './pages/Register'
import Leaderboard from './pages/Leaderboard'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/events"        element={<Events />} />
        <Route path="/events/:id"    element={<EventDetail />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/leaderboard"   element={<Leaderboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
