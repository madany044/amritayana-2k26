import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './EventCard.module.css'

export default function EventCard({ event }) {
  const navigate = useNavigate()

  return (
    <motion.div
      className={styles.card}
      onClick={() => navigate(`/events/${event.id}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.img}>
        <div className={styles.emoji}>{event.emoji || '🏆'}</div>
        <div className={styles.overlay} />
        <span className={`badge badge-${event.category} ${styles.badge}`}>
          {event.category}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.title}>{event.name}</div>
        <div className={styles.meta}>
          <span>📅 {event.date}</span>
          <span>📍 {event.venue}</span>
        </div>
        <p className={styles.desc}>{event.description}</p>
      </div>
    </motion.div>
  )
}
