import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className={styles.nav}>
      <span className={styles.logo} onClick={() => navigate('/')}>AMRITAYANA-2K26</span>

      <div className={styles.links}>
        <NavLink to="/"           className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} end>Home</NavLink>
        <NavLink to="/events"     className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Events</NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Leaderboard</NavLink>
        <button className={styles.cta} onClick={() => navigate('/register')}>Register Now</button>
      </div>
    </nav>
  )
}
