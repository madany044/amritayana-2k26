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
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* MINI MARQUEE */}
            <div className={styles.miniMarqueeWrap}>
              <div className={styles.miniMarqueeInner}>
                {[...Array(8)].map((_, i) => (
                  <span key={i} className={styles.miniMarqueeItem}>
                    AMRITAYANA-2K26 <span className={styles.miniMarqueeDot} />
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.heroTag}>
              April 06–30, 2026 &nbsp;|&nbsp; MRIT Campus
            </div>

            <h1 className={styles.heroH1}>
              THE <span className="grad-text">ANNUAL</span> FEST
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
            {[
              ['9', 'Events'], 
              ['7', 'Branches'], 
              ['24', 'Days']
            ].map(([n, l]) => (
              <div key={l} className={styles.statCard}>
                <div className={styles.statNum}>{n}</div>
                <div className={styles.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeInner}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>
              {item} &nbsp; • &nbsp;
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <EventCard event={ev} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
