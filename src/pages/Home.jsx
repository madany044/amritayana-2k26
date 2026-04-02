import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchEvents } from '../services/firebase'
import EventCard from '../components/EventCard'
import styles from './Home.module.css'

const MARQUEE_ITEMS = ['Chess', 'Table Tennis', 'Volleyball', 'Kabaddi', 'Cricket', 'Throwball', 'Badminton', 'Tug of War']

export default function Home() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data ?? []))
      .catch(console.error)
  }, [])

  const featured = events.slice(0, 4)

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.heroTag}>
            <span className={styles.pulse} />
            April 06–30, 2026 &nbsp;|&nbsp; MRIT Campus
          </div>

          <h1 className={styles.heroH1}>
            THE<br />
            <span className="grad-text">ANNUAL</span><br />
            FEST
          </h1>

          <p className={styles.heroSub}>
            A Bunch of competition, culture, and celebration. Represent your branch,
            dominate the arena, and etch your name in glory.
          </p>

          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => navigate('/events')}>Explore Events</button>
            <button className="btn-outline" onClick={() => navigate('/register')}>Register Now</button>
          </div>
        </motion.div>

        <div className={styles.heroStats}>
          {[['9', 'Events'], ['7', 'Branches'], ['2', 'Days']].map(([n, l]) => (
            <motion.div
              key={l}
              className={styles.statCard}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className={styles.statNum}>{n}</div>
              <div className={styles.statLabel}>{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeInner}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              <span className={styles.marqueeDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED EVENTS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <div className="section-tag">// featured_events</div>
            <div className="section-title">COMPETE. WIN. REPEAT.</div>
          </div>
          <button className="btn-outline" onClick={() => navigate('/events')}>View All →</button>
        </div>

        <div className={styles.grid}>
          {featured.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <EventCard event={ev} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
