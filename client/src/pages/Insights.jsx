// Insights.jsx
// Insights & Videos page — fetches posts and videos from Supabase
// Includes category filter bar, featured post, post grid, video list, sidebar

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import styles from './Insights.module.css'

// ── Filter categories ──
const categories = ['All', 'Geopolitics', 'Business', 'Self-Development', 'Vlogs', 'Shorts']

// ── Fallback posts if Supabase returns nothing ──
const fallbackPosts = [
  {
    id: 1,
    title: 'Why the Middle East Shift Matters for Pakistan',
    slug: 'middle-east-shift-pakistan',
    excerpt: 'A deep analysis of how regional geopolitical changes are reshaping Pakistan\'s economic landscape and what professionals must understand right now.',
    category: 'Geopolitics',
    is_featured: true,
    read_time: 8,
    views: 4800,
    icon: '🌍',
  },
  {
    id: 2,
    title: 'How to Read Global Markets Before They Move',
    slug: 'read-global-markets',
    excerpt: 'The frameworks experienced analysts use to anticipate market movements before they happen.',
    category: 'Business',
    is_featured: false,
    read_time: 6,
    views: 2200,
    icon: '💵',
  },
  {
    id: 3,
    title: 'The 3 Mental Models Every Leader Needs',
    slug: 'mental-models-leaders',
    excerpt: 'Practical thinking frameworks that separate reactive managers from strategic leaders.',
    category: 'Self-Development',
    is_featured: false,
    read_time: 5,
    views: 1500,
    icon: '🧠',
  },
  {
    id: 4,
    title: 'Behind the Scenes: How I Prepare a Geopolitical Analysis',
    slug: 'behind-scenes-analysis',
    excerpt: 'A vlog-style breakdown of the research, sourcing, and thinking process behind every video.',
    category: 'Vlogs',
    is_featured: false,
    read_time: 4,
    views: 900,
    icon: '🎥',
  },
]

// ── Fallback videos ──
const fallbackVideos = [
  { id: 1, title: 'Why the Middle East Shift Matters for Pakistan Economy', category: 'Geopolitics',       views: '48K', duration: '18:42' },
  { id: 2, title: 'How to Read Global Markets Before They Move',            category: 'Business Strategy', views: '22K', duration: '12:15' },
  { id: 3, title: 'The 3 Mental Models Every Leader Needs Right Now',       category: 'Self-Growth',       views: '15K', duration: '09:30' },
]

// ── Popular sidebar items ──
const popularItems = [
  { title: 'The US-China Tech War: Pakistan\'s Hidden Opportunity', reads: '34K reads' },
  { title: 'How to Read a Country\'s Political Risk in 20 Minutes',  reads: '21K reads' },
  { title: 'Gulf 2030: What Pakistanis Must Know Before Moving',     reads: '18K reads' },
]

// ══════════════════════════════════════════════
// INSIGHTS PAGE COMPONENT
// ══════════════════════════════════════════════
export default function Insights() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [posts, setPosts]               = useState([])
  const [videos, setVideos]             = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)
  const [email, setEmail]               = useState('')
  const [subscribing, setSubscribing]   = useState(false)

  // ── Fetch insights / posts ──
  useEffect(() => {
    async function fetchPosts() {
      try {
        let query = supabase
          .from('insights')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(6)

        if (activeFilter !== 'All') {
          query = query.eq('category', activeFilter)
        }

        const { data, error } = await query
        if (error) throw error
        setPosts(data && data.length > 0 ? data : fallbackPosts)
      } catch {
        setPosts(fallbackPosts)
      } finally {
        setPostsLoading(false)
      }
    }
    fetchPosts()
  }, [activeFilter])

  // ── Fetch videos ──
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
        setVideos(data && data.length > 0 ? data : fallbackVideos)
      } catch {
        setVideos(fallbackVideos)
      } finally {
        setVideosLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // ── Email subscribe ──
  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, source: 'insights_page' }])

      if (error) {
        if (error.code === '23505') {
          toast.error("You're already subscribed!")
        } else {
          throw error
        }
      } else {
        toast.success("You're subscribed! Welcome aboard. 🎉")
        setEmail('')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  // ── Split posts into featured + rest ──
  const featuredPost = posts.find((p) => p.is_featured) || posts[0]
  const gridPosts    = posts.filter((p) => p.id !== featuredPost?.id).slice(0, 4)

  // ── Category icons map ──
  const categoryIcons = {
    Geopolitics:      '🌍',
    Business:         '💵',
    'Self-Development': '🧠',
    Vlogs:            '🎥',
    Shorts:           '⚡',
  }

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <div className="page-header">
        <div className="page-header-glow" />
        <div className="page-header-inner">
          <span className="eyebrow">Insights &amp; Videos</span>
          <h1 className="display-title" style={{ color: 'var(--white)' }}>
            Analysis That <em>Moves</em> You Forward.
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '16px',
            maxWidth: '540px',
            marginTop: '8px',
          }}>
            Long-form analysis, short clips, vlogs, and breakdowns — built for
            people who act on what they know. Follow{' '}
            <span style={{ color: 'var(--gold)' }}>@imsheikhishtiaq</span>{' '}
            for daily content.
          </p>
        </div>
      </div>

      {/* ─── FILTER BAR ─── */}
      <div className={styles.filterSection}>
        <div className={styles.filterInner}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ''}`}
              onClick={() => {
                setActiveFilter(cat)
                setPostsLoading(true)
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.contentLayout}>

            {/* ── Main Column ── */}
            <div>
              {postsLoading ? (
                <div className={styles.loadingState}>Loading insights...</div>
              ) : posts.length === 0 ? (
                <div className={styles.emptyState}>
                  No posts found in this category yet.
                </div>
              ) : (
                <>
                  {/* Featured Post */}
                  {featuredPost && (
                    <div className={styles.featuredPost}>
                      <div className={styles.featuredPostImg}>
                        <span className={styles.featuredBadge}>📌 Pinned This Week</span>
                        {categoryIcons[featuredPost.category] || '🌍'}
                      </div>
                      <div className={styles.featuredPostBody}>
                        <span className={styles.postTag}>
                          {featuredPost.category}
                        </span>
                        <h3>{featuredPost.title}</h3>
                        <p>{featuredPost.excerpt}</p>
                        <p className={styles.featuredMeta}>
                          {featuredPost.read_time && `${featuredPost.read_time} min read`}
                          {featuredPost.views && ` · ${featuredPost.views.toLocaleString()} views`}
                        </p>
                        <a href="#" className="btn-gold" style={{ fontSize: '13px', padding: '10px 20px' }}>
                          Read Full Analysis →
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Post Grid */}
                  {gridPosts.length > 0 && (
                    <div className={styles.postGrid}>
                      {gridPosts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                          <div className={styles.postCardImg}>
                            {categoryIcons[post.category] || '📝'}
                          </div>
                          <div className={styles.postCardBody}>
                            <span className={styles.postTag}>{post.category}</span>
                            <h4>{post.title}</h4>
                            <p className={styles.postCardMeta}>
                              {post.read_time && `${post.read_time} min read`}
                              {post.views && ` · ${post.views.toLocaleString()} views`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Video List ── */}
              <div className={styles.videoStrip}>
                <h3 className={styles.videoStripTitle}>Latest Videos</h3>
                {videosLoading ? (
                  <div className={styles.loadingState}>Loading videos...</div>
                ) : (
                  <div className={styles.videoList}>
                    {videos.map((v) => (
                      <div key={v.id} className={styles.videoListItem}>
                        <div className={styles.videoThumbSmall}>▶</div>
                        <div className={styles.videoListInfo}>
                          <p className={styles.videoListCategory}>{v.category}</p>
                          <p className={styles.videoListTitle}>{v.title}</p>
                          <p className={styles.videoListMeta}>
                            {v.views && `${v.views} views`}
                            {v.duration && ` · ${v.duration}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className={styles.sidebar}>

              {/* Email subscribe */}
              <div className={styles.sidebarBox}>
                <h4>Weekly Brief</h4>
                <p className={styles.sidebarDesc}>
                  Sheikh Ishtiaq's curated analysis — every Sunday.
                </p>
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className={styles.sidebarInput}
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className={styles.sidebarSubmit}
                    disabled={subscribing}
                  >
                    {subscribing ? 'Subscribing...' : 'Subscribe Free →'}
                  </button>
                </form>
              </div>

              {/* Popular posts */}
              <div className={styles.sidebarBox}>
                <h4>Most Popular</h4>
                {popularItems.map((item, i) => (
                  <div key={i} className={styles.popularItem}>
                    <span className={styles.popularNum}>0{i + 1}</span>
                    <div>
                      <h5>{item.title}</h5>
                      <span>{item.reads}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <div className={styles.sidebarBox}>
                <h4>Join WhatsApp Channel</h4>
                <p className={styles.sidebarDesc}>
                  Daily insights from @imsheikhishtiaq — directly on WhatsApp.
                </p>
                <button className={styles.whatsappBtn}>
                  💬 Join @imsheikhishtiaq
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <div style={{
        background: 'var(--gold)',
        padding: '56px 6%',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(22px, 4vw, 36px)',
          color: 'var(--ink)',
          marginBottom: '10px',
        }}>
          Want Analysis Tailored to Your Situation?
        </h2>
        <p style={{
          color: 'rgba(13,13,13,0.7)',
          marginBottom: '24px',
          fontSize: '15px',
        }}>
          Book a 1-on-1 session with Sheikh Ishtiaq for personalised strategic clarity.
        </p>
        <Link to="/contact" className="btn-dark">
          Book a Consultation →
        </Link>
      </div>
    </>
  )
}