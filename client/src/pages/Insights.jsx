// Insights.jsx
// Insights & Analysis page — articles only, no videos
// Includes category filter bar, featured article, article grid, sidebar

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import styles from './Insights.module.css'

// ── Filter categories ──
const categories = ['All', 'Geopolitics', 'Business', 'Self-Development']

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


// ── Popular sidebar items ──
const popularItems = [
  { title: 'The US-China Tech War: Pakistan\'s Hidden Opportunity', reads: '34K reads' },
  { title: 'How to Read a Country\'s Political Risk in 20 Minutes',  reads: '21K reads' },
  { title: 'Gulf 2030: What Pakistanis Must Know Before Moving',     reads: '18K reads' },
]

// ── Category icons map ──
const categoryIcons = {
  Geopolitics: '🌍',
  Business: '💼',
  'Self-Development': '🧠',
  Default: '📝',
}

// ── Get category icon ──
function getCategoryIcon(category) {
  return categoryIcons[category] || categoryIcons.Default
}

// ══════════════════════════════════════════════
// INSIGHTS PAGE COMPONENT
// ══════════════════════════════════════════════
export default function Insights() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [posts, setPosts] = useState([])
  const [popularPosts, setPopularPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  // ── Fetch insights / posts ──
  useEffect(() => {
    async function fetchPosts() {
      try {
        let query = supabase
          .from('insights')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(20)

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

  // ── Fetch popular posts ──
  useEffect(() => {
    async function fetchPopularPosts() {
      try {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('is_published', true)
          .order('views', { ascending: false })
          .limit(3)

        if (error) throw error
        setPopularPosts(data || [])
      } catch {
        setPopularPosts([])
      }
    }
    fetchPopularPosts()
  }, [])


  // ── Email subscribe ──
  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, source: 'insights_sidebar' }])

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

  // ── Handle article click ──
  function handleArticleClick(slug) {
    navigate(`/insights/${slug}`)
  }

  // ── Split posts into featured + rest ──
  const featuredPost = posts.find((p) => p.is_featured)
  const gridPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <div className="page-header">
        <div className="page-header-glow" />
        <div className="page-header-inner">
          <span className="eyebrow">KNOWLEDGE HUB</span>
          <h1 className="display-title" style={{ color: 'var(--white)' }}>
            Insights &amp; Analysis
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '16px',
            maxWidth: '540px',
            marginTop: '8px',
          }}>
            Deep dives into geopolitics, business strategy and personal growth by Sheikh Ishtiaq
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
            <div className={styles.mainColumn}>
              {postsLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.skeletonCard} />
                  <div className={styles.skeletonCard} />
                  <div className={styles.skeletonCard} />
                  <div className={styles.skeletonCard} />
                </div>
              ) : posts.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📝</div>
                  <h3>No articles in this category yet</h3>
                  <p>Check back soon for new insights</p>
                </div>
              ) : (
                <>
                  {/* Featured Article */}
                  {featuredPost && (
                    <div 
                      className={styles.featuredArticle}
                      onClick={() => handleArticleClick(featuredPost.slug)}
                    >
                      <div className={styles.featuredImage}>
                        {featuredPost.cover_image_url ? (
                          <img 
                            src={featuredPost.cover_image_url} 
                            alt={featuredPost.title}
                            className={styles.featuredImageImg}
                          />
                        ) : (
                          <div className={styles.featuredImagePlaceholder}>
                            📰
                          </div>
                        )}
                        <span className={styles.featuredBadge}>📌 FEATURED</span>
                      </div>
                      <div className={styles.featuredContent}>
                        <span className={styles.categoryTag}>{featuredPost.category}</span>
                        <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                        <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                        <div className={styles.featuredMeta}>
                          <div className={styles.authorRow}>
                            <div>
                              <div className={styles.authorName}>{featuredPost.author || 'Sheikh Ishtiaq'}</div>
                              <div className={styles.articleMeta}>
                                {featuredPost.read_time} min read · {new Date(featuredPost.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className={styles.readButton}>Read Article →</button>
                      </div>
                    </div>
                  )}

                  {/* Articles Grid */}
                  {gridPosts.length > 0 && (
                    <div className={styles.articlesGrid}>
                      {gridPosts.map((post) => (
                        <div 
                          key={post.id} 
                          className={styles.articleCard}
                          onClick={() => handleArticleClick(post.slug)}
                        >
                          <div className={styles.cardImageArea}>
                            {post.cover_image_url ? (
                              <div 
                                className={styles.cardImage}
                                style={{ backgroundImage: `url(${post.cover_image_url})` }}
                              />
                            ) : (
                              <div className={styles.cardImagePlaceholder}>
                                {getCategoryIcon(post.category)}
                              </div>
                            )}
                            <span className={styles.cardCategoryBadge}>{post.category}</span>
                          </div>
                          <div className={styles.cardBody}>
                            <h3 className={styles.cardTitle}>{post.title}</h3>
                            <p className={styles.cardExcerpt}>{post.excerpt}</p>
                            <div className={styles.cardFooter}>
                              <div className={styles.cardAuthor}>
                                <span className={styles.cardAuthorName}>{post.author || 'Sheikh Ishtiaq'}</span>
                              </div>
                              <div className={styles.cardMeta}>
                                <span className={styles.readTime}>{post.read_time} min</span>
                                <span className={styles.views}>{post.views || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className={styles.sidebar}>
              {/* About Sheikh Ishtiaq */}
              <div className={styles.sidebarBox}>
                <div className={styles.aboutSection}>
                  <h4>Sheikh Ishtiaq</h4>
                  <p className={styles.aboutTitle}>The Growth Strategist</p>
                  <p className={styles.aboutBio}>Strategic advisor helping leaders navigate complexity and unlock growth opportunities.</p>
                  <a 
                    href="https://instagram.com/imsheikhishtiaq" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.followButton}
                  >
                    Follow on Instagram
                  </a>
                </div>
              </div>

              {/* Popular Articles */}
              <div className={styles.sidebarBox}>
                <h4 className={styles.sidebarTitle}>Most Read</h4>
                {popularPosts.length > 0 ? (
                  popularPosts.map((post, i) => (
                    <div 
                      key={post.id} 
                      className={styles.popularItem}
                      onClick={() => handleArticleClick(post.slug)}
                    >
                      <span className={styles.popularNum}>{i + 1}</span>
                      <div className={styles.popularContent}>
                        <h5>{post.title}</h5>
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>
                  ))
                ) : (
                  popularItems.map((item, i) => (
                    <div key={i} className={styles.popularItem}>
                      <span className={styles.popularNum}>{i + 1}</span>
                      <div className={styles.popularContent}>
                        <h5>{item.title}</h5>
                        <span>{item.reads}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Newsletter Subscribe */}
              <div className={styles.sidebarBox}>
                <h4 className={styles.sidebarTitle}>Get Insights in Your Inbox</h4>
                <p className={styles.sidebarDesc}>Weekly analysis delivered to you</p>
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
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </div>

              {/* Join WhatsApp */}
              <div className={styles.sidebarBoxGold}>
                <h4 className={styles.sidebarBoxGoldTitle}>Join 2K+ Members on WhatsApp</h4>
                <a 
                  href="https://whatsapp.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  Join Channel →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}