// admin/src/pages/Insights.jsx
// Manage blog posts with full CRUD functionality

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
const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.4)',
  fontFamily: 'monospace',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

const CATEGORIES = ['Geopolitics', 'Business', 'Self-Development']

export default function Insights() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: CATEGORIES[0],
    cover_image_url: '',
    author: 'Sheikh Ishtiaq',
    read_time: 5,
    views: 0,
    is_published: false,
    is_featured: false,
  })

  useEffect(() => { fetchItems() }, [])

  // Auto-generate slug from title
  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load insights')
    else setItems(data || [])
    setLoading(false)
  }

  function openAddModal() {
    setEditingItem(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: CATEGORIES[0],
      cover_image_url: '',
      author: 'Sheikh Ishtiaq',
      read_time: 5,
      views: 0,
      is_published: false,
      is_featured: false,
    })
    setShowModal(true)
  }

  function openEditModal(item) {
    setEditingItem(item)
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || CATEGORIES[0],
      cover_image_url: item.cover_image_url || '',
      author: item.author || 'Sheikh Ishtiaq',
      read_time: item.read_time || 5,
      views: item.views || 0,
      is_published: item.is_published || false,
      is_featured: item.is_featured || false,
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      title: formData.title.trim(),
      slug: formData.slug.trim() || generateSlug(formData.title),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      author: formData.author.trim(),
    }

    if (!submitData.title) {
      toast.error('Title is required')
      return
    }

    let result
    if (editingItem) {
      result = await supabase.from('insights').update(submitData).eq('id', editingItem.id)
    } else {
      result = await supabase.from('insights').insert(submitData)
    }

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(editingItem ? 'Insight updated successfully' : 'Insight added successfully')
      setShowModal(false)
      fetchItems()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this article? This cannot be undone.')) {
      return
    }

    const { error } = await supabase.from('insights').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete insight')
    } else {
      toast.success('Insight deleted successfully')
      fetchItems()
    }
  }

  function handleInputChange(field, value) {
    if (field === 'title') {
      // Auto-generate slug when title changes
      const slug = generateSlug(value)
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        slug: prev.slug || slug
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Content</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Insights & Posts</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Manage blog posts and articles.</p>
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
                  <th style={th}>Author</th>
                  <th style={th}>Read Time</th>
                  <th style={th}>Views</th>
                  <th style={th}>Published</th>
                  <th style={th}>Featured</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ ...td, color: '#fff', maxWidth: '280px' }}>{item.title}</td>
                    <td style={{ ...td, color: '#C9A227' }}>{item.category}</td>
                    <td style={td}>{item.author || 'Sheikh Ishtiaq'}</td>
                    <td style={td}>{item.read_time || 0} min</td>
                    <td style={td}>{item.views || 0}</td>
                    <td style={td}>
                      <span style={{
                        padding: '3px 10px',
                        background: item.is_published ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${item.is_published ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
                        color: item.is_published ? '#10B981' : 'rgba(255,255,255,0.4)',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'Arial, sans-serif',
                      }}>
                        {item.is_published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{
                        padding: '3px 10px',
                        background: item.is_featured ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${item.is_featured ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.12)'}`,
                        color: item.is_featured ? '#C9A227' : 'rgba(255,255,255,0.4)',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'Arial, sans-serif',
                      }}>
                        {item.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={td}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(item)
                        }}
                        style={{
                          background: 'rgba(201,162,39,0.1)',
                          border: '1px solid rgba(201,162,39,0.3)',
                          color: '#C9A227',
                          padding: '4px 10px',
                          borderRadius: '2px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: 'Arial, sans-serif',
                          transition: 'background 0.2s',
                          marginRight: '8px'
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(201,162,39,0.2)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(201,162,39,0.1)'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id)
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
          title={editingItem ? 'Edit Insight' : 'Add New Insight'}
          onClose={() => setShowModal(false)}
          width="760px"
        >
          <form onSubmit={handleSave}>
            {/* BASIC INFO SECTION */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '10px',
                color: '#C9A227',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                marginTop: '20px',
                borderBottom: '1px solid rgba(201,162,39,0.3)',
                paddingBottom: '8px'
              }}>
                BASIC INFO
              </div>
              
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
                <label style={labelStyle}>Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C9A227'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  placeholder="auto-generated-from-title"
                />
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  URL: /insights/your-slug
                </div>
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
                    <option key={cat} value={cat} style={{ color: '#C9A227' }}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MEDIA SECTION */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '10px',
                color: '#C9A227',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                marginTop: '20px',
                borderBottom: '1px solid rgba(201,162,39,0.3)',
                paddingBottom: '8px'
              }}>
                MEDIA
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Cover Image URL</label>
                <input
                  type="text"
                  value={formData.cover_image_url}
                  onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C9A227'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  placeholder="https://example.com/image.jpg"
                />
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  Paste a direct image URL for the article cover
                </div>
                {formData.cover_image_url && (
                  <div style={{ marginTop: '8px' }}>
                    <img 
                      src={formData.cover_image_url} 
                      alt="Cover preview" 
                      style={{
                        width: '100%',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '2px',
                        border: '1px solid rgba(255,255,255,0.12)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '10px',
                color: '#C9A227',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                marginTop: '20px',
                borderBottom: '1px solid rgba(201,162,39,0.3)',
                paddingBottom: '8px'
              }}>
                CONTENT
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Excerpt ({formData.excerpt.length}/300)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      handleInputChange('excerpt', e.target.value)
                    }
                  }}
                  rows={3}
                  maxLength={300}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '80px',
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A227'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  placeholder="Brief summary shown in article cards (max 300 chars)"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={12}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '300px',
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A227'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  placeholder="Write the full article here. Use line breaks for paragraphs. You can use ## for headings and **text** for bold."
                />
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  Tip: Use ## Heading for section titles and **bold** for emphasis
                </div>
              </div>
            </div>

            {/* SETTINGS SECTION */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '10px',
                color: '#C9A227',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                marginTop: '20px',
                borderBottom: '1px solid rgba(201,162,39,0.3)',
                paddingBottom: '8px'
              }}>
                SETTINGS
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9A227'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>Read Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.read_time}
                    onChange={(e) => handleInputChange('read_time', parseInt(e.target.value) || 1)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9A227'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                    placeholder="5"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <Toggle
                    value={formData.is_published}
                    onChange={(value) => handleInputChange('is_published', value)}
                    label="Published"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <Toggle
                    value={formData.is_featured}
                    onChange={(value) => handleInputChange('is_featured', value)}
                    label="Featured"
                  />
                </div>
              </div>
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