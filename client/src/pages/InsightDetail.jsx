// InsightDetail.jsx
// Individual article page with full content display

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaXTwitter, FaLinkedin, FaCopy } from 'react-icons/fa6'
import { supabase } from '../lib/supabase'
import styles from './InsightDetail.module.css'

export default function InsightDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data: articleData, error: articleError } = await supabase
          .from('insights')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single()

        if (articleError) throw articleError
        if (!articleData) {
          navigate('/insights')
          return
        }

        setArticle(articleData)

      } catch (error) {
        console.error('Error fetching article:', error)
        toast.error('Article not found')
        navigate('/insights')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug, navigate])

  function handleCopyLink() {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  function formatContent(content) {
    if (!content) return []
    
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim().startsWith('## ')) {
        return (
          <h2 key={index} className="article-heading">
            {paragraph.replace('## ', '')}
          </h2>
        )
      }
      
      let formattedText = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      return (
        <p 
          key={index} 
          className="article-paragraph"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      )
    })
  }

  if (loading) {
    return (
      <div className={styles.pageLoading}>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonHeader} />
          <div className={styles.skeletonMeta} />
          <div className={styles.skeletonContent} />
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className={styles.pageError}>
        <h2>Article not found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/insights" className={styles.backLink}>← Back to Insights</Link>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className={`page-header ${styles.articleHeader}`}>
        <div className="container">
          <div className={styles.articleHeaderContent}>
            <div className={styles.articleBreadcrumb}>
              <Link to="/insights" className={`${styles.link} ${styles.insightsLink}`}>Insights</Link>
              <span className={styles.separator}>/</span>
              <span className={styles.current}>{article.category}</span>
            </div>
            
            <h1 className={styles.articleTitle}>{article.title}</h1>
            
            <div className={styles.articleMetaRow}>
              <div className={styles.articleAuthorInfo}>
                <div className={styles.authorAvatar}>SI</div>
                <div>
                  <div className={styles.authorName}>{article.author || 'Sheikh Ishtiaq'}</div>
                  <div className={styles.articleDate}>
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className={styles.articleStats}>
                <span className={styles.readTime}>{article.read_time} min read</span>
                <span className={styles.views}>{(article.views || 0) + 1} views</span>
                <span className={styles.categoryTag}>{article.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className={styles.articleContent}>
        <div className="container">
          <div className={styles.articleBody}>
            {/* Cover Image */}
            {article.cover_image_url && (
              <div className={styles.articleCoverImage}>
                <img 
                  src={article.cover_image_url} 
                  alt={article.title}
                  className={styles.coverImage}
                />
              </div>
            )}

            {/* Article Excerpt */}
            {article.excerpt && (
              <div className={styles.articleExcerpt}>
                <p>{article.excerpt}</p>
              </div>
            )}

            {/* Article Content */}
            <div className={styles.articleText}>
              {formatContent(article.content)}
            </div>

            {/* Share Section */}
            <div className={styles.articleShare}>
              <h3>Share this article</h3>
              <div className={styles.shareButtons}>
                <button 
                  onClick={handleCopyLink} 
                  className={`${styles.shareButton} ${styles.copyButton}`}
                >
                  <FaCopy />
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.shareButton} ${styles.twitterButton}`}
                >
                  <FaXTwitter />
                  <span>Share on X</span>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.shareButton} ${styles.linkedinButton}`}
                >
                  <FaLinkedin />
                  <span>Share on LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Back Button */}
            <Link to="/insights" className={styles.backButton}>
              ← Back to Insights
            </Link>
          </div>
        </div>
      </article>

          </>
  )
}
