// About.jsx
// Full About page — bio, story blocks, authority markers, philosophy quote
// Matches the HTML template design exactly, uses placeholder image for now

import { Link } from 'react-router-dom'
import styles from './About.module.css'

const storyBlocks = [
  {
    title: 'Background',
    text: "Rooted in Pakistan's complex political economy, with deep exposure to Gulf markets, US dynamics, and South Asian security affairs.",
  },
  {
    title: 'Expertise Evolution',
    text: 'From academic research to live advisory — combining institutional knowledge with real-world strategic insight across 12+ years.',
  },
  {
    title: 'Current Mission',
    text: 'Democratising geopolitical intelligence and digital growth through the TGD ecosystem — accessible to all, not just institutions.',
  },
  {
    title: 'Geographic Exposure',
    text: 'Pakistan, UAE, Saudi Arabia, US policy corridors, and South-East Asian economic hubs.',
  },
]

const markers = [
  '12+ years of active geopolitical analysis and strategic advisory',
  '500+ individual consultations delivered across 3 continents',
  '18K+ followers across 9 digital platforms as @imsheikhishtiaq',
  'Founder of the TGD ecosystem — Transform, Grow, Digitalize',
  'Trusted by professionals in finance, law, civil service, and entrepreneurship',
]

const stats = [
  { num: '12+',  label: 'Years Experience' },
  { num: '500+', label: 'Consultations Done' },
  { num: '18K+', label: 'Digital Followers' },
  { num: '40+',  label: 'Countries Reached' },
]

const expertise = [
  {
    icon: '🌍',
    title: 'Geopolitical Analysis',
    desc: 'Deep-dive analysis of global power dynamics, regional conflicts, and their direct impact on business, careers, and daily decisions.',
  },
  {
    icon: '📈',
    title: 'Business Strategy',
    desc: 'Strategic frameworks for entrepreneurs and professionals navigating volatile economic and political environments.',
  },
  {
    icon: '🚀',
    title: 'Digital Growth (TGD)',
    desc: 'Building powerful personal brands and digital presence through the TGD ecosystem — Transform, Grow, Digitalize.',
  },
  {
    icon: '✈️',
    title: 'Global Mobility',
    desc: 'Professional guidance for US visa applications, international career moves, and cross-border professional strategy.',
  },
  {
    icon: '🎓',
    title: 'Mentorship & Coaching',
    desc: 'Structured coaching programs that take professionals from confusion to clarity with real accountability and measurable milestones.',
  },
  {
    icon: '🎙️',
    title: 'Speaking & Media',
    desc: 'Keynote addresses, podcast appearances, panel discussions, and media commentary on geopolitics and strategic affairs.',
  },
]

export default function About() {
  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <div className="page-header">
        <div className="page-header-glow" />
        <div className="page-header-inner">
          <span className="eyebrow">About Sheikh Ishtiaq</span>
          <h1 className="display-title" style={{ color: 'var(--white)' }}>
            Analytical Depth.<br />
            <em>Strategic Clarity.</em>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '16px',
            maxWidth: '520px',
            marginTop: '8px',
          }}>
            Geopolitical analyst, strategic advisor, and digital educator —
            known across 9 platforms as @imsheikhishtiaq.
          </p>
        </div>
      </div>

      {/* ─── MAIN ABOUT GRID ─── */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>

            {/* Image Column */}
            <div className={styles.imageCol}>
              <div style={{ position: 'relative' }}>
                <div className={styles.photoPlaceholder}>🎙️</div>
                <div className={styles.photoFrame} />
                <div className={styles.accentBox}>
                  <span className={styles.accentBoxLabel}>Known As</span>
                  <span className={styles.accentBoxValue}>The Growth Strategist</span>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className={styles.textCol}>
              <span className="eyebrow">The Story</span>
              <h2 className="display-title">
                From Analysis to <em>Impact.</em>
              </h2>
              <div className="gold-line" />

              <p className={styles.bio}>
                Sheikh Ishtiaq is a geopolitical analyst, strategic advisor, and digital
                educator — known across 9 platforms as{' '}
                <strong>@imsheikhishtiaq</strong>. He operates at the intersection of
                global affairs, business strategy, and human potential through his TGD
                ecosystem: <em>Transform. Grow. Digitalize.</em>
              </p>

              <p className={styles.bio}>
                Over 12+ years, he has mentored 500+ professionals and delivered
                analysis that bridges the gap between global forces and the everyday
                decisions of real people — in boardrooms, living rooms, and everywhere
                in between.
              </p>

              {/* Story Blocks */}
              <div className={styles.storyBlocks}>
                {storyBlocks.map((block) => (
                  <div key={block.title} className={styles.storyBlock}>
                    <h4>{block.title}</h4>
                    <p>{block.text}</p>
                  </div>
                ))}
              </div>

              {/* Authority Markers */}
              <div className={styles.markerList}>
                {markers.map((m) => (
                  <div key={m} className={styles.marker}>
                    <div className={styles.markerDot} />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              {/* Philosophy Quote */}
              <div className={styles.philosophyBlock}>
                <p className={styles.philosophyQuote}>
                  "Geopolitics is not a spectator sport. The people who understand
                  global forces are the ones who shape what comes next — for
                  themselves and their organisations."
                </p>
                <span className={styles.philosophyAuthor}>
                  — Sheikh Ishtiaq · @imsheikhishtiaq
                </span>
              </div>

              {/* CTA Buttons */}
              <div className={styles.ctaRow}>
                <Link to="/consulting" className="btn-gold">
                  Work With Me →
                </Link>
                <Link to="/tgd" className="btn-outline-dark">
                  Explore TGD →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <div className={styles.statsStrip}>
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statBox}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── EXPERTISE SECTION ─── */}
      <section className={styles.expertiseSection}>
        <div className="container">
          <span className="eyebrow">Areas of Expertise</span>
          <h2 className="display-title">
            What Sheikh Ishtiaq <em>Does Best.</em>
          </h2>
          <div className="gold-line" />

          <div className={styles.expertiseGrid}>
            {expertise.map((e) => (
              <div key={e.title} className={styles.expertiseCard}>
                <span className={styles.expertiseIcon}>{e.icon}</span>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <div className={styles.ctaBanner}>
        <h2>Ready to Work With Sheikh Ishtiaq?</h2>
        <p>
          Whether it's a one-off session or an ongoing advisory relationship —
          the first step is a conversation.
        </p>
        <div className={styles.ctaBannerButtons}>
          <Link to="/contact" className={styles.btnDarkSolid}>
            Book a Consultation →
          </Link>
          <Link to="/insights" className={styles.btnOutlineInk}>
            Read the Analysis
          </Link>
        </div>
      </div>
    </>
  )
}