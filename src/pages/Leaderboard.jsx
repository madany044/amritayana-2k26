import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchLeaderboard } from '../services/firebase'
import styles from './Leaderboard.module.css'

const MEDAL = ['🥇', '🥈', '🥉']
const RANK_COLORS = ['var(--accent)', '#C0C0C0', '#CD7F32']

export default function Leaderboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  function load() {
    setLoading(true)
    fetchLeaderboard()
      .then(rows => {
        setData(rows)
        setLastUpdated(new Date())
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const max = data[0]?.points || 1

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className="section-tag">// branch_standings</div>
            <div className={styles.title}>LEADERBOARD</div>
            <p className={styles.sub}>
              Live branch rankings. 1st&nbsp;→&nbsp;10 pts &nbsp;•&nbsp; 2nd&nbsp;→&nbsp;6 pts &nbsp;•&nbsp; 3rd&nbsp;→&nbsp;3 pts
            </p>
          </div>
          <button className="btn-outline" onClick={load}>↻ Refresh</button>
        </div>

        {/* Points legend */}
        <div className={styles.legend}>
          {[['1st', '10 pts', 'var(--accent)'], ['2nd', '6 pts', '#C0C0C0'], ['3rd', '3 pts', '#CD7F32']].map(([pos, pts, color]) => (
            <div key={pos} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              <span style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>{pos} place</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color }}>{pts}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.loading}>Loading standings…</div>
        ) : data.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏆</div>
            <div className={styles.emptyText}>No results yet. Check back after events!</div>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.thead}>
              <span className={styles.thRank}>Rank</span>
              <span className={styles.thBranch}>Branch</span>
              <span className={styles.thPts}>Points</span>
              <span className={styles.thBar}>Progress</span>
            </div>

            {data.map((row, i) => (
              <motion.div
                key={row.branch}
                className={`${styles.row} ${i === 0 ? styles.rowFirst : ''}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
              >
                {/* Rank */}
                <div className={styles.rank}>
                  {i < 3
                    ? <span className={styles.medal}>{MEDAL[i]}</span>
                    : <span className={styles.rankNum} style={{ color: 'var(--text3)' }}>{i + 1}</span>
                  }
                </div>

                {/* Branch */}
                <div className={styles.branch}>
                  <span className={styles.branchName}>{row.branch}</span>
                  {i === 0 && <span className={styles.leaderTag}>Leading</span>}
                </div>

                {/* Points */}
                <div
                  className={styles.pts}
                  style={{ color: RANK_COLORS[i] ?? 'var(--text)' }}
                >
                  {row.points}
                  <span className={styles.ptsLabel}>pts</span>
                </div>

                {/* Bar */}
                <div className={styles.barWrap}>
                  <motion.div
                    className={styles.bar}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((row.points / max) * 100)}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.6, ease: 'easeOut' }}
                    style={{
                      background: i === 0 ? 'var(--grad)' : `rgba(${i === 1 ? '192,192,192' : i === 2 ? '205,127,50' : '136,146,170'},0.5)`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {lastUpdated && (
          <div className={styles.timestamp}>
            Last updated: {lastUpdated.toLocaleTimeString()} · Auto-sync via Supabase
          </div>
        )}
      </div>
    </div>
  )
}
