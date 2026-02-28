import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

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

// ── Media type emoji mapping ───────────────────────────────────
function getMediaEmoji(mediaType) {
  const emojiMap = {
    'Podcast': '🎙️',
    'Event': '🎤',
    'Speech': '📢',
    'Interview': '🎬',
    'Webinar': '💻',
    'Press': '📰',
    'Photo': '📸',
  }
  return emojiMap[mediaType] || '🌐'
}

export default function Media() {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const filters = [
    "All",
    "Podcast",
    "Event",
    "Speech",
    "Interview",
    "Webinar",
    "Press",
  ];

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredItems(mediaItems);
    } else {
      setFilteredItems(
        mediaItems.filter(
          (item) => item.media_type === activeFilter
        )
      );
    }
  }, [activeFilter, mediaItems]);

  // ── Video popup escape key handler ───────────────────────────────
  useEffect(() => {
    if (activeVideo) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setActiveVideo(null)
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [activeVideo]);

  async function fetchMedia() {
    setLoading(true);

    const { data, error } = await supabase
      .from("media_gallery")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Unable to load media items");
    } else {
      setMediaItems(data || []);
      setFilteredItems(data || []);
    }

    setLoading(false);
  }

  function handleCardClick(item) {
    if (!item.media_url) return;
    
    const videoId = getYouTubeVideoId(item.media_url);
    if (videoId) {
      // Open video popup
      setActiveVideo(item);
    } else {
      // Open URL in new tab
      window.open(item.media_url, '_blank');
    }
  }

  return (
    <div className="section container">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <span className="eyebrow">PUBLIC PRESENCE</span>
        <h1 className="display-title" style={{ marginBottom: '16px' }}>
          Appearances & <em>Media</em>
        </h1>
        <div className="gold-line" />
        <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '500px', marginTop: '16px' }}>
          Podcasts, speeches, interviews and press features from around the world
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'rgba(26, 26, 46, 0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,162,39,0.15)',
          padding: '0 6%',
          display: 'flex',
          gap: '8px',
          position: 'sticky',
          top: '66px',
          zIndex: 100,
          marginBottom: '40px',
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '10px 20px',
              background: activeFilter === filter ? 'rgba(201,162,39,0.12)' : 'transparent',
              border: activeFilter === filter ? '1px solid rgba(201,162,39,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: activeFilter === filter ? '#C9A227' : 'rgba(255,255,255,0.5)',
              borderRadius: '2px',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Arial',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter) {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.color = 'rgba(255,255,255,0.7)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter) {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255,255,255,0.5)';
              }
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginTop: '40px',
        }}
      >
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <div className="loader">Loading media...</div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '60px' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', marginBottom: '8px' }}>
              No {activeFilter === 'All' ? 'media' : activeFilter.toLowerCase()} appearances yet
            </p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
              Check back soon
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const videoId = getYouTubeVideoId(item.media_url);
            const hasVideo = !!videoId;
            const emoji = getMediaEmoji(item.media_type);
            
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: item.media_url ? 'pointer' : 'default',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (item.media_url) {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.borderColor = 'rgba(201,162,39,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (item.media_url) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  }
                }}
              >
                {/* Thumbnail Area */}
                <div
                  style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #16213E, #0F3460)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Media Type Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(13,13,13,0.8)',
                      border: '1px solid rgba(201,162,39,0.4)',
                      color: '#C9A227',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '2px',
                    }}
                  >
                    {item.media_type}
                  </div>
                  
                  {/* Emoji Icon */}
                  <span style={{ fontSize: '48px' }}>{emoji}</span>
                  
                  {/* Play Button for YouTube Videos */}
                  {hasVideo && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(201,162,39,0.9)',
                        color: '#0D0D0D',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                      }}
                    >
                      ▶
                    </div>
                  )}
                </div>
                
                {/* Card Body */}
                <div style={{ padding: '18px' }}>
                  <h3 style={{ 
                    fontFamily: 'Georgia, serif', 
                    fontSize: '16px', 
                    color: '#fff', 
                    marginBottom: '6px',
                    lineHeight: '1.3'
                  }}>
                    {item.event_name || item.title}
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: 'rgba(255,255,255,0.5)', 
                    marginBottom: '8px' 
                  }}>
                    {item.media_type}
                  </p>
                  <p style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '11px', 
                    color: 'rgba(255,255,255,0.3)' 
                  }}>
                    {item.event_date ? new Date(item.event_date).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Video Popup Modal */}
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
                  {activeVideo.media_type}
                </div>
                <div
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: '400',
                  }}
                >
                  {activeVideo.event_name || activeVideo.title}
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
                const videoId = getYouTubeVideoId(activeVideo.media_url);
                if (!videoId) return null;
                
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
                    title={activeVideo.event_name || activeVideo.title}
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
    </div>
  );
}
