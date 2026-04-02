import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchEvents } from '../services/firebase'
import EventCard from '../components/EventCard'
import styles from './Events.module.css'

const FILTERS = ['all', 'solo', 'doubles', 'team']

export default function Events() {
  const [events, setEvents]     = useState([])
  const [query, setQuery]       = useState('')
  const [filter, setFilter]     = useState('all')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return events.filter(ev => {
      const matchCat = filter === 'all' || ev.category === filter
      const matchQ   = ev.name.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQ
    })
  }, [events, filter, query])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-tag">// all_events</div>
          <div className="section-title">ALL EVENTS</div>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search events..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterBtns}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles[`active_${f}`] : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className={styles.loading}>Loading events...</div>
        ) : (
          <motion.div className={styles.grid} layout>
            <AnimatePresence>
              {filtered.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <EventCard event={ev} />
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className={styles.empty}>No events match your search.</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
