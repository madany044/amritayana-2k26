import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchEventById } from '../services/firebase'
import styles from './EventDetail.module.css'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventById(id)
      .then(setEvent)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className={styles.loading}>Loading…</div>
  if (!event) return <div className={styles.loading}>Event not found.</div>

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/events')}>
          ← Back to Events
        </button>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Image banner */}
          <div className={styles.banner}>
            {event.image_url
              ? <img src={event.image_url} alt={event.name} className={styles.bannerImg} />
              : <div className={styles.bannerEmoji}>{event.emoji || '🏆'}</div>
            }
          </div>

          <div className={styles.body}>
            {/* Header */}
            <div className={styles.header}>
              <span className={`badge badge-${event.category}`}>{event.category}</span>
              <h1 className={styles.title}>{event.name}</h1>
            </div>

            {/* Meta grid */}
            <div className={styles.metaGrid}>
              {[
                ['Date', event.date],
                ['Venue', event.venue],
                ['Category', event.category],
                ['Format', event.category === 'solo' ? '1 Player' : event.category === 'doubles' ? '2 Players' : 'Team'],
              ].map(([label, value]) => (
                <div key={label} className={styles.metaItem}>
                  <div className={styles.metaLabel}>{label}</div>
                  <div className={styles.metaValue}>{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <p className={styles.desc}>{event.description}</p>
            )}

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <div className={styles.rules}>
                <h3 className={styles.rulesTitle}>Rules & Info</h3>
                <ul className={styles.rulesList}>
                  {event.rules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {/* CTA */}
            { (event.name?.toLowerCase().includes('chess') || 
                event.name?.toLowerCase().includes('cooking with fire')) ? (
              <div
                className={`btn-primary ${styles.cta}`}
                style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', cursor: 'not-allowed', textAlign: 'center' }}
              >
                Registration Closed
              </div>
            ) : (
              <button
                className={`btn-primary ${styles.cta}`}
                onClick={() => navigate(`/register?event=${event.id}`)}
              >
                Register for This Event →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
