// Consulting.jsx
// Consulting & Coaching page — who cards, packages, process steps, testimonials, urgency bar
// Matches the HTML template design exactly

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './Consulting.module.css'

// ── Who this is for ──
const whoCards = [
  { icon: '💼', title: 'Professionals',         desc: 'Career decisions with global dimensions' },
  { icon: '🚀', title: 'Entrepreneurs',         desc: 'Building in volatile political & economic climates' },
  { icon: '🎓', title: 'Students',              desc: 'Planning international education & career strategy' },
  { icon: '✈️', title: 'Aspiring Global Movers', desc: 'Professionals relocating internationally' },
]

// ── Packages ──
const packages = [
  {
    num: 'Package 01',
    title: 'One-on-One Strategy Session',
    duration: '60 minutes · Single session',
    featured: false,
    features: [
      'Personalised situational analysis',
      'Geopolitical framing of your challenge',
      'Actionable step-by-step recommendations',
      'Follow-up resource list',
    ],
    cta: 'Book Now →',
  },
  {
    num: 'Package 02',
    title: 'Structured Coaching Program',
    duration: 'Multi-session · 4–8 weeks',
    featured: true,
    badge: 'Most Popular',
    features: [
      'Structured roadmap from day one',
      'Weekly one-on-one sessions',
      'Progress tracking & accountability',
      'Geopolitical briefings relevant to you',
      'Direct WhatsApp access between sessions',
    ],
    cta: 'Apply Now →',
  },
  {
    num: 'Package 03',
    title: 'Premium Advisory',
    duration: 'High-touch · Monthly retainer',
    featured: false,
    features: [
      'Dedicated ongoing advisory relationship',
      'Unlimited WhatsApp communication',
      'Custom research & briefings',
      'Introductions to relevant networks',
      'Priority booking & response',
    ],
    cta: 'Enquire →',
  },
]

// ── Process steps ──
const processSteps = [
  {
    num: '1',
    title: 'Book',
    desc: 'Fill out the short form. Choose your session type and preferred time.',
  },
  {
    num: '2',
    title: 'Assess',
    desc: 'Sheikh Ishtiaq reviews your context before the session — so every minute counts.',
  },
  {
    num: '3',
    title: 'Execute',
    desc: 'Walk away with clarity, a framework, and the confidence to act immediately.',
  },
]

// ── Fallback testimonials ──
const fallbackTestimonials = [
  {
    id: 1,
    client_name: 'Ahmad F.',
    client_role: 'Founder, Export Company',
    client_location: 'Karachi, Pakistan',
    content: 'Sheikh Ishtiaq does not just give you analysis — he gives you a framework to think independently. My entire approach to business risk changed after one session.',
    rating: 5,
  },
  {
    id: 2,
    client_name: 'Sana M.',
    client_role: 'Doctor',
    client_location: 'Lahore, Pakistan',
    content: 'After two visa refusals, I was ready to give up. Sheikh Ishtiaq reviewed my case, rebuilt my application, and I got approved. That is expertise, not luck.',
    rating: 5,
  },
  {
    id: 3,
    client_name: 'Bilal R.',
    client_role: 'Investment Analyst',
    client_location: 'Dubai, UAE',
    content: 'The coaching program gave me the exact clarity I needed before making the biggest career decision of my life. Worth every minute.',
    rating: 5,
  },
]

// ══════════════════════════════════════════════
// CONSULTING PAGE COMPONENT
// ══════════════════════════════════════════════
export default function Consulting() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)

  // ── Fetch testimonials ──
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .eq('is_featured', true)
          .limit(3)

        if (error) throw error
        setTestimonials(data && data.length > 0 ? data : fallbackTestimonials)
      } catch {
        setTestimonials(fallbackTestimonials)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <div className="page-header">
        <div className="page-header-glow" />
        <div className="page-header-inner">
          <span className="eyebrow">Consulting &amp; Coaching</span>
          <h1 className="display-title" style={{ color: 'var(--white)' }}>
            Strategic Clarity for Leaders,<br />
            Professionals &amp; <em>Aspirants.</em>
          </h1>
          <p className={styles.headerSub}>
            One session can shift your entire trajectory. Whether you're navigating
            a career pivot, a business decision, or a geopolitical blind spot —
            Sheikh Ishtiaq gives you the clarity to act.
          </p>
        </div>
      </div>

      {/* ─── WHO THIS IS FOR ─── */}
      <section className={styles.whoSection}>
        <div className="container">
          <span className="eyebrow">Who This Is For</span>
          <h2 className="display-title" style={{ color: 'var(--white)' }}>
            Built for People Who <em>Act.</em>
          </h2>

          <div className={styles.whoGrid}>
            {whoCards.map((card) => (
              <div key={card.title} className={styles.whoCard}>
                <span className={styles.whoIcon}>{card.icon}</span>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACKAGES ─── */}
      <section className={styles.packagesSection}>
        <div className="container">
          <span className="eyebrow">Service Packages</span>
          <h2 className="display-title" style={{ color: 'var(--white)' }}>
            Choose Your <em>Engagement Level.</em>
          </h2>

          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div
                key={pkg.num}
                className={`${styles.packageCard} ${pkg.featured ? styles.packageFeatured : ''}`}
              >
                {pkg.badge && (
                  <span className={styles.pkgBadge}>{pkg.badge}</span>
                )}
                <span className={styles.pkgNum}>{pkg.num}</span>
                <h3>{pkg.title}</h3>
                <span className={styles.pkgDuration}>{pkg.duration}</span>
                <ul className={styles.pkgFeatures}>
                  {pkg.features.map((f) => (
                    <li key={f}>
                      <span className={styles.pkgCheck}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-gold">
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS STEPS ─── */}
      <section className={styles.processSection}>
        <div className="container">
          <span className="eyebrow" style={{ textAlign: 'center', display: 'block' }}>
            How It Works
          </span>
          <h2 className="display-title" style={{ textAlign: 'center' }}>
            Simple. Clear. <em>Effective.</em>
          </h2>

          <div className={styles.processRow}>
            {processSteps.map((step) => (
              <div key={step.num} className={styles.processStep}>
                <div className={styles.stepNum}>{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <span className="eyebrow">Client Results</span>
          <h2 className="display-title" style={{ color: 'var(--white)' }}>
            What Clients <em>Actually Say.</em>
          </h2>

          {loading ? (
            <div className="loader" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Loading testimonials...
            </div>
          ) : (
            <div className={styles.tGrid}>
              {testimonials.map((t) => (
                <div key={t.id} className={styles.tCard}>
                  <div className={styles.tStars}>{'★'.repeat(t.rating || 5)}</div>
                  <p className={styles.tQuote}>"{t.content}"</p>
                  <div className={styles.tAuthor}>{t.client_name}</div>
                  <div className={styles.tRole}>
                    {t.client_role}
                    {t.client_location && ` · ${t.client_location}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── URGENCY BAR ─── */}
      <div className={styles.urgencyBar}>
        <div className={styles.urgencyText}>
          <h3>Limited Spots Each Month. Seriously.</h3>
          <p>
            Intake is kept deliberately small so every client gets Sheikh Ishtiaq's
            full attention. If you're ready, don't wait.
          </p>
        </div>
        <Link to="/contact" className={styles.btnDark}>
          Reserve Your Consultation →
        </Link>
      </div>
    </>
  )
}