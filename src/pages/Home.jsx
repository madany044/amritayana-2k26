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
      .then(data => {
        if (!data) return setEvents([]);
        // Sort by date (assuming April 2026 for all)
        const sorted = [...data].sort((a, b) => {
          const dayA = parseInt(a.date?.match(/\d+/)?.[0] || 0);
          const dayB = parseInt(b.date?.match(/\d+/)?.[0] || 0);
          return dayA - dayB;
        });
        setEvents(sorted);
      })
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
              ['22', 'Events'],
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

      {/* MEGA EVENTS */}
      <section className={styles.megaSection}>
        <div className={styles.sectionHeader}>
          <div>
            <div className="section-tag">// fest_highlights</div>
            <div className="section-title">MEGA EVENTS.</div>
            <p style={{ color: 'var(--text2)', marginTop: '0.8rem', fontSize: '1.05rem' }}> Pure entertainment, culture & celebrations.</p>
          </div>
        </div>

        <div className={styles.megaScrollWrap}>
          {[
            { date: '06 Apr 2026', title: 'Logo Launch & Flash Mob', desc: 'The grand kickoff to Amritayana! Witness an electrifying flash mob.', bg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800' },
            { date: '27 Apr 2026', title: 'Ethnic Day', desc: 'Celebrate culture and tradition in your best and most beautiful ethnic wear.', bg: 'https://images.unsplash.com/photo-1599318011235-904154a09c36?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { date: '28 Apr 2026', title: 'Fun Fair & Treasure Hunt', desc: 'Enjoy stalls, fun games, treasure hunting, and crazy mismatched outfits.', bg: 'https://images.unsplash.com/photo-1675225410545-79c63b2bd3f9?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { date: '29 Apr 2026', title: 'Stage Events', desc: 'Singing & Dance Competitions. Watch the best talents battle it out on stage.', bg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800' },
            { date: '30 Apr 2026', title: 'Grand Finale', desc: 'Formal Program, spectacular Fashion Show, & an unforgettable DJ Event.', bg: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.megaCardImg}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className={styles.megaCardBg} style={{ backgroundImage: `url(${item.bg})` }} />
              <div className={styles.megaCardOverlay}>
                <div className={styles.megaDateImg}>{item.date}</div>
                <div className={styles.megaTitleImg}>{item.title}</div>
                <div className={styles.megaDescImg}>{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
