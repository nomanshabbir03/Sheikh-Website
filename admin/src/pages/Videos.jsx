// admin/src/pages/Videos.jsx
// Manage YouTube videos with full CRUD functionality

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import Toggle from '../components/Toggle'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)' }
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '2px',
  color: '#ffffff',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}
const focusStyle = { borderColor: '#C9A227' }
const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.4)',
  fontFamily: 'monospace',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

const CATEGORIES = ['Geopolitics', 'Business Strategy', 'Self-Growth', 'Vlogs', 'Shorts', 'Podcast', 'Event', 'Speech', 'Interview', 'Webinar', 'Press']

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    category: CATEGORIES[0],
    duration: '',
    views: '',
    is_published: false,
    is_featured: false,
  })

  useEffect(() => { fetchVideos() }, [])

  async function fetchVideos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load videos')
    else setVideos(data || [])
    setLoading(false)
  }

  function openAddModal() {
    setEditingVideo(null)
    setFormData({
      title: '',
      youtube_url: '',
      category: CATEGORIES[0],
      duration: '',
      views: '',
      is_published: false,
      is_featured: false,
    })
    setShowModal(true)
  }

  function openEditModal(video) {
    setEditingVideo(video)
    setFormData({
      title: video.title || '',
      youtube_url: video.youtube_url || '',
      category: video.category || CATEGORIES[0],
      duration: video.duration || '',
      views: video.views || '',
      is_published: video.is_published || false,
      is_featured: video.is_featured || false,
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      title: formData.title.trim(),
      youtube_url: formData.youtube_url.trim(),
    }

    if (!submitData.title || !submitData.youtube_url) {
      toast.error('Title and YouTube URL are required')
      return
    }

    let result
    if (editingVideo) {
      result = await supabase.from('videos').update(submitData).eq('id', editingVideo.id)
    } else {
      result = await supabase.from('videos').insert(submitData)
    }

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(editingVideo ? 'Video updated successfully' : 'Video added successfully')
      setShowModal(false)
      fetchVideos()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this? This cannot be undone.')) {
      return
    }

    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete video')
    } else {
      toast.success('Video deleted successfully')
      fetchVideos()
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Content</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Videos</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Manage YouTube videos and their metadata.</p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: '#C9A227',
            color: '#0D0D0D',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '2px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = '#B89323'}
          onMouseLeave={e => e.target.style.background = '#C9A227'}
        >
          + Add New
        </button>
      </div>

      <div style={cardStyle}>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Category</th>
                  <th style={th}>Duration</th>
                  <th style={th}>Views</th>
                  <th style={th}>Published</th>
                  <th style={th}>Featured</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(video => (
                  <tr 
                    key={video.id}
                    onClick={() => openEditModal(video)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.02)' }
                    onMouseLeave={e => e.target.style.background = 'transparent' }
                  >
                    <td style={{ ...td, color: '#fff', maxWidth: '280px' }}>{video.title}</td>
                    <td style={{ ...td, color: '#C9A227' }}>{video.category}</td>
                    <td style={td}>{video.duration || '—'}</td>
                    <td style={td}>{video.views || '—'}</td>
                    <td style={td}>
                      <span style={{
                        padding: '3px 10px',
                        background: video.is_published ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${video.is_published ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
                        color: video.is_published ? '#10B981' : 'rgba(255,255,255,0.4)',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'Arial, sans-serif',
                      }}>
                        {video.is_published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{
                        padding: '3px 10px',
                        background: video.is_featured ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${video.is_featured ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.12)'}`,
                        color: video.is_featured ? '#C9A227' : 'rgba(255,255,255,0.4)',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'Arial, sans-serif',
                      }}>
                        {video.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={td}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(video.id)
                        }}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          color: '#ef4444',
                          padding: '4px 10px',
                          borderRadius: '2px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: 'Arial, sans-serif',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editingVideo ? 'Edit Video' : 'Add New Video'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>YouTube URL *</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  color: '#C9A227',
                }}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="18:42"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Views</label>
              <input
                type="text"
                value={formData.views}
                onChange={(e) => handleInputChange('views', e.target.value)}
                placeholder="48K"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Toggle
                value={formData.is_published}
                onChange={(value) => handleInputChange('is_published', value)}
                label="Published"
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <Toggle
                value={formData.is_featured}
                onChange={(value) => handleInputChange('is_featured', value)}
                label="Featured"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Arial, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                  e.target.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: '#C9A227',
                  color: '#0D0D0D',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'Arial, sans-serif',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = '#B89323'}
                onMouseLeave={e => e.target.style.background = '#C9A227'}
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
