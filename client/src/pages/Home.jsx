// Home.jsx
// Full Home page — Hero, Platform Strip, Videos, Services, Testimonials, Email Capture
// Fetches videos and testimonials from Supabase in real time

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import styles from './Home.module.css'
import HeroSection from "../components/sections/HeroSection"
import VisaConsultancySection from "../components/sections/VisaConsultancySection"
import AnimatedCounter from "../components/AnimatedCounter"
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaLinkedin, FaSnapchat, FaTwitter, FaGlobe } from 'react-icons/fa'

// ── YouTube thumbnail helper ──────────────────────────────────────
function getYouTubeThumbnail(url) {
  if (!url) return null
  try {
    // Handle these URL formats:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // https://youtube.com/shorts/VIDEO_ID
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regExp)
    const videoId = match ? match[1] : null
    if (!videoId) return null
    // Use hqdefault as it is more reliable across all videos
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
  } catch {
    return null
  }
}

// ── YouTube video ID extractor ───────────────────────────────────
function getYouTubeVideoId(url) {
  if (!url) return null
  try {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  } catch {
    return null
  }
}

// ── Platform data ──────────────────────────────────────
const platforms = [
  { icon: <FaFacebook />, name: 'Facebook',    count: '@imsheikhishtiaq' },
  { icon: <FaInstagram />, name: 'Instagram',   count: '@imsheikhishtiaq' },
  { icon: <FaWhatsapp />, name: 'WhatsApp',    count: '2K+ Members' },
  { icon: <FaTiktok />, name: 'TikTok',      count: '@imsheikhishtiaq' },
  { icon: <FaYoutube />, name: 'YouTube',     count: '18K+ Subs' },
  { icon: <FaLinkedin />, name: 'LinkedIn',    count: '4K+ Connections' },
  { icon: <FaSnapchat />, name: 'Snapchat',    count: '@imsheikhishtiaq' },
  { icon: <FaTwitter />, name: 'X (Twitter)', count: '6K+ Followers' },
  { icon: <FaGlobe />, name: 'Website',     count: 'imsheikhishtiaq.com' },
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
  { 
    id: 1, 
    title: 'Why the Middle East Shift Matters for Pakistan Economy', 
    category: 'Geopolitics', 
    views: '48K', 
    duration: '18:42',
    is_featured: true,
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  { 
    id: 2, 
    title: 'How to Read Global Markets Before They Move', 
    category: 'Business Strategy', 
    views: '22K',
    duration: '12:15',
    is_featured: false,
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  { 
    id: 3, 
    title: 'The 3 Mental Models Every Leader Needs Right Now', 
    category: 'Self-Growth', 
    views: '15K',
    duration: '8:30',
    is_featured: false,
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
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
  const [activeVideo, setActiveVideo] = useState(null)

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
        
        console.log('=== VIDEO DEBUG ===')
        console.log('data:', data)
        console.log('error:', error)
        console.log('count:', data?.length)
        
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

  // ── Modal escape key ───────────────────────────────────
  useEffect(() => {
    if (activeVideo) {
      // Escape key listener
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setActiveVideo(null)
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      // Cleanup
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [activeVideo])

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

      {/* ─── VISA CONSULTANCY SECTION ─── */}
      <VisaConsultancySection />

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
              {videos.map((v, i) => {
                const thumbnail = getYouTubeThumbnail(v.youtube_url)
                return (
                  <div 
                    key={v.id} 
                    className={styles.videoCard}
                    onClick={() => setActiveVideo(v)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div 
                      className={styles.videoThumb}
                      style={{
                        backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
                        backgroundSize: thumbnail ? 'cover' : undefined,
                        backgroundPosition: thumbnail ? 'center' : undefined,
                      }}
                    >
                      {(v.is_featured || i === 0) && (
                        <span className={styles.videoFeaturedBadge}>🔥 Featured</span>
                      )}
                      <div 
                        className={styles.playBtn}
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          border: '2px solid rgba(255,255,255,0.8)',
                          color: 'white',
                        }}
                      >▶</div>
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
                )
              })}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link 
              to="/media" 
              className="btn-ghost"
              style={{ marginTop: '40px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              View All Media & Appearances →
            </Link>
          </div>
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
                <span className={styles.impactNum}>
                  <AnimatedCounter target={s.num} duration={2000} />
                </span>
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

      {/* ─── VIDEO MODAL ─── */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.0)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              pointerEvents: 'all',
              width: '560px',
              maxWidth: 'calc(100vw - 48px)',
              background: '#0D0D0D',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: '#1A1A2E',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#C9A227',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  {activeVideo.category}
                </div>
                <div
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: '400',
                  }}
                >
                  {activeVideo.title}
                </div>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#C9A227'
                  e.target.style.background = 'rgba(201,162,39,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255,255,255,0.6)'
                  e.target.style.background = 'none'
                }}
              >
                ×
              </button>
            </div>

            {/* Video Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 0,
                paddingBottom: '56.25%', // 16:9 aspect ratio
                background: '#000',
              }}
            >
              {(() => {
                const videoId = getYouTubeVideoId(activeVideo.youtube_url)
                if (!videoId) return null
                
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeVideo.title}
                  />
                )
              })()}
            </div>

            {/* Footer hint */}
            <div
              style={{
                padding: '12px 20px',
                background: '#1A1A2E',
                textAlign: 'center',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
              }}
            >
              Press ESC or click outside to close
            </div>
          </div>
        </div>
      )}
    </>
  )
}
