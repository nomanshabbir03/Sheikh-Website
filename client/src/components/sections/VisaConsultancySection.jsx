// VisaConsultancySection.jsx
// Professional Visa Consultancy section with Statue of Liberty background and elegant design

import { Link } from 'react-router-dom'
import styles from './VisaConsultancySection.module.css'

export default function VisaConsultancySection() {
  return (
    <Link to="/visa" className={styles.visaSection}>
      <div className={styles.visaBackground}>
        <div className={styles.particles}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
        <div className={styles.visaContent}>
          <span className={styles.visaLabel}>CONSULTANCY SERVICES</span>
          <h2 className={styles.visaTitle}>Your Gateway to the United States</h2>
          {/* <p className={styles.visaSubtitle}>Expert USA Visa guidance, every step of the way</p> */}
          <button className={styles.ctaButton}>Explore Visa Services →</button>
        </div>
      </div>
    </Link>
  )
}
