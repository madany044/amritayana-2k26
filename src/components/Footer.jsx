import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.queryText}>Facing any issues or queries?</p>
          <p className={styles.contactLabel}>Contact:</p>
          <div className={styles.contactDetails}>
            <div className={styles.names}>
              <span>Madan Y</span>
              <span>Hemanth C</span>
              <span>Nisarga H</span>
            </div>
            <a href="tel:9353240289" className={styles.phone}>[9353240289]</a>
            <p className={styles.dept}>CSE Final Year</p>
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
