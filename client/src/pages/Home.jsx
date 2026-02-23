// Home.jsx
// Full Home page — Hero, Platform Strip, Videos, Services, Testimonials, Email Capture
// Fetches videos and testimonials from Supabase in real time

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import styles from './Home.module.css'
import HeroSection from "../components/sections/HeroSection"

// ── Platform data ──────────────────────────────────────
const platforms = [
  { icon: '📘', name: 'Facebook',    count: '@imsheikhishtiaq' },
  { icon: '📸', name: 'Instagram',   count: '@imsheikhishtiaq' },
  { icon: '💬', name: 'WhatsApp',    count: '2K+ Members' },
  { icon: '🎵', name: 'TikTok',      count: '@imsheikhishtiaq' },
  { icon: '▶️', name: 'YouTube',     count: '18K+ Subs' },
  { icon: '💼', name: 'LinkedIn',    count: '4K+ Connections' },
  { icon: '👻', name: 'Snapchat',    count: '@imsheikhishtiaq' },
  { icon: '🐦', name: 'X (Twitter)', count: '6K+ Followers' },
  { icon: '🌐', name: 'Website',     count: 'imsheikhishtiaq.com' },
]

// ── Static fallback testimonials ──
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
    content: 'The TGD Personal Brand course changed how I show up online. I went from zero presence to consistent content in 3 weeks. Practical, no fluff.',
    rating: 5,
  },
]

// ── Static fallback videos ──
const fallbackVideos = [
  { id: 1, title: 'Why the Middle East Shift Matters for Pakistan Economy', category: 'Geopolitics',       views: '48K', is_featured: true },
  { id: 2, title: 'How to Read Global Markets Before They Move',            category: 'Business Strategy', views: '22K', is_featured: false },
  { id: 3, title: 'The 3 Mental Models Every Leader Needs Right Now',       category: 'Self-Growth',       views: '15K', is_featured: false },
]

// ── Services data ──
const services = [
  {
    num: '01',
    title: '1-on-1 Consulting',
    desc: 'Focused strategy sessions for professionals and entrepreneurs navigating complex decisions with global dimensions.',
    link: '/consulting',
    cta: 'Learn More →',
  },
  {
    num: '02',
    title: 'Coaching Programs',
    desc: 'Structured multi-session coaching with a roadmap, accountability, and real milestones — built around your goals.',
    link: '/consulting',
    cta: 'Learn More →',
  },
  {
    num: '03',
    title: 'US Visa Guidance',
    desc: 'Professional preparation for US B1/B2 visa applicants — first-timers, refusal cases, and business visitors.',
    link: '/visa',
    cta: 'Learn More →',
  },
  {
    num: '04',
    title: 'TGD Courses',
    desc: 'Transform. Grow. Digitalize. Online courses designed for professionals ready to level up in the digital era.',
    link: '/tgd',
    cta: 'Explore TGD →',
  },
]

// ── Impact stats ──
const impactStats = [
  { num: '500+', label: 'Consultations Delivered' },
  { num: '18K+', label: '@imsheikhishtiaq Followers' },
  { num: '9',    label: 'Platforms Active' },
  { num: '12+',  label: 'Years Experience' },
]

// ═══════════════════════════════════════════════════════
// HOME PAGE COMPONENT
// ═══════════════════════════════════════════════════════
export default function Home() {
  const [videos, setVideos] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  // ── Fetch videos ──────────────────────────────────────
  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3)
        if (error) throw error
        setVideos(data?.length ? data : fallbackVideos)
      } catch {
        setVideos(fallbackVideos)
      } finally {
        setVideosLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // ── Fetch testimonials ────────────────────────────────
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
        setTestimonials(data?.length ? data : fallbackTestimonials)
      } catch {
        setTestimonials(fallbackTestimonials)
      } finally {
        setTestimonialsLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // ── Email subscribe ───────────────────────────────────
  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return

    setSubscribing(true)
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, source: 'home_page' }])
      if (error) {
        if (error.code === '23505') {
          toast.error("You're already subscribed!")
        } else throw error
      } else {
        toast.success("You're subscribed! 🎉")
        setEmail('')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <HeroSection />

      {/* ─── PLATFORM STRIP ─── */}
      <div className={styles.platformStrip}>
        {platforms.map((p, i) => (
          <div key={p.name} style={{ display: 'contents' }}>
            <a href="#" className={styles.platformItem}>
              <span className={styles.platformItemIcon}>{p.icon}</span>
              <span className={styles.platformItemName}>{p.name}</span>
              <span className={styles.platformItemCount}>{p.count}</span>
            </a>
            {i < platforms.length - 1 && <div className={styles.platformDivider} />}
          </div>
        ))}
      </div>

      {/* ─── FEATURED VIDEO GRID ─── */}
      <section className={styles.videoSection}>
        <div className="container">
          <span className="eyebrow">Latest Content</span>
          <h2 className="display-title" style={{ color: 'var(--white)' }}>
            Watch. Learn. <em>Act.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '500px' }}>
            Raw, direct analysis across geopolitics, business strategy, and personal growth.
          </p>

          {videosLoading ? (
            <div className="loader">Loading videos...</div>
          ) : (
            <div className={styles.videoGrid}>
              {videos.map((v, i) => (
                <div key={v.id} className={styles.videoCard}>
                  <div className={styles.videoThumb}>
                    {(v.is_featured || i === 0) && (
                      <span className={styles.videoFeaturedBadge}>🔥 Featured</span>
                    )}
                    <div className={styles.playBtn}>▶</div>
                  </div>
                  <div className={styles.videoInfo}>
                    <p className={styles.videoCategory}>{v.category}</p>
                    <p className={styles.videoTitle}>{v.title}</p>
                    <p className={styles.videoMeta}>
                      {v.views && `${v.views} views`}
                      {v.duration && ` · ${v.duration}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* ─── SERVICES SNAPSHOT ─── */}
      <section className={styles.servicesSection}>
        <div className="container">
          <span className="eyebrow">What I Offer</span>
          <h2 className="display-title">
            Work With <em>Sheikh Ishtiaq</em>
          </h2>
          <div className="gold-line" />
          <div className={styles.servicesGrid}>
            {services.map((s) => (
              <div key={s.num} className={styles.serviceCard}>
                <div className={styles.serviceNum}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to={s.link} className="btn-outline-dark">
                  {s.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider} />

      {/* ─── TESTIMONIALS ─── */}
      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.testimonialsHeader}>
            <span className="eyebrow">What People Say</span>
            <h2 className="display-title" style={{ color: 'var(--white)' }}>
              Results Are the Only <em>Review That Matters.</em>
            </h2>
          </div>

          {testimonialsLoading ? (
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

          {/* Impact numbers */}
          <div className={styles.impactRow}>
            {impactStats.map((s) => (
              <div key={s.label} className={styles.impactBox}>
                <span className={styles.impactNum}>{s.num}</span>
                <span className={styles.impactLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMAIL CAPTURE ─── */}
      <div className={styles.emailSection}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
          Stay Informed
        </span>
        <h2>Get Weekly Geopolitical &amp;<br />Strategy Insights — Free.</h2>
        <p>
          No fluff. No noise. Just Sheikh Ishtiaq's curated analysis,
          every Sunday morning. Join 18K+ followers @imsheikhishtiaq.
        </p>
        <form className={styles.emailForm} onSubmit={handleSubscribe}>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.emailSubmit} disabled={subscribing}>
            {subscribing ? 'Subscribing...' : 'Subscribe →'}
          </button>
        </form>
      </div>
    </>
  )
}
