import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.logoWrap} onClick={() => { navigate('/'); close(); }}>
        <img src="/logo.png" alt="Logo" className={styles.logoImg} />
        <span className={styles.logoText}>MYSURU ROYAL INSTITUTE OF TECHNOLOGY</span>
      </div>

      <button className={styles.menuBtn} onClick={toggle}>
        <div className={styles.hamburger} />
      </button>

      <div className={`${styles.links} ${isOpen ? styles.linksOpen : ''}`}>
        <NavLink to="/" onClick={close} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} end>Home</NavLink>
        <NavLink to="/events" onClick={close} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Events</NavLink>
        <NavLink to="/leaderboard" onClick={close} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>Leaderboard</NavLink>
        <button className={styles.cta} onClick={() => { navigate('/register'); close(); }}>Register Now</button>
      </div>
    </nav>
  )
}
