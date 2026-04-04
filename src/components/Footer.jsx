import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.queryText}>Facing any issues or queries?</p>
          <div className={styles.contactCard}>
            <span className={styles.label}>Contact:</span>
            <span className={styles.name}>Madan Y</span>
            <a href="tel:9353240289" className={styles.phone}>( 9353240289 )</a>
            <span className={styles.dept}>, CSE- Final Year</span>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; 2026 Amritayana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
