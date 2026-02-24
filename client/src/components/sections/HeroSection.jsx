import styles from "./HeroSection.module.css";
import { Link } from "react-router-dom";
import tutor1 from '../assets/tutor1.jpg';

export default function HeroSection() {
  return (
    <section className={styles.hero} id="home">
      <div className={`${styles.heroInner} container`}>

        {/* LEFT COLUMN */}
        <div>

          <div className={styles.heroBadge}>
            Available for Consultation
          </div>

          <h1>
            Sheikh Ishtiaq —<br />
            <em>The Growth Strategist</em>
          </h1>

          <p className={styles.heroTagline}>
            Geopolitics · Business · Global Mobility
          </p>

          <p className={styles.heroDiscipline}>
            Analyst · Advisor · Educator · Mentor
          </p>

          <p className={styles.heroSub}>
            I help professionals, entrepreneurs, and aspirants cut
            through complexity — and turn sharp insight into
            real-world strategic advantage.
          </p>

          <p className={styles.heroHandle}>
            Follow: <span>@imsheikhishtiaq</span> across all platforms
          </p>

          {/* ACTION BUTTONS */}
          <div className={styles.heroActions}>
            <Link to="/contact" className="btn-gold">
              Book Consultation →
            </Link>

            <Link to="/insights" className="btn-ghost">
              ▶ Watch Latest Analysis
            </Link>
          </div>

          {/* STATS */}
          <div className={styles.heroStats}>
            <div>
              <span className={styles.statNum}>18K+</span>
              <span className={styles.statLabel}>Followers</span>
            </div>

            <div>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Sessions Done</span>
            </div>

            <div>
              <span className={styles.statNum}>12+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>

            <div>
              <span className={styles.statNum}>9</span>
              <span className={styles.statLabel}>Platforms</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.heroImageCol}>
          <div className={styles.heroPhotoFrame}>
            <img
              src={tutor1}
              alt="Sheikh Ishtiaq — The Growth Strategist"
            />

            <div className={styles.heroTagFloat}>
              <strong>12+</strong>
              Years of Geopolitical
              <br />
              & Advisory Experience
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
