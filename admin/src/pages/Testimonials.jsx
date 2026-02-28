// admin/src/pages/Testimonials.jsx
// Manage client testimonials with full CRUD functionality

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import Toggle from '../components/Toggle'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }
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

const SERVICE_TYPES = ['Consulting', 'Visa Guidance', 'TGD Courses', 'Coaching', 'General']

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    client_location: '',
    content: '',
    rating: 5,
    service_type: SERVICE_TYPES[0],
    is_published: false,
    is_featured: false,
  })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load testimonials')
    else setItems(data || [])
    setLoading(false)
  }

  function openAddModal() {
    setEditingItem(null)
    setFormData({
      client_name: '',
      client_role: '',
      client_location: '',
      content: '',
      rating: 5,
      service_type: SERVICE_TYPES[0],
      is_published: false,
      is_featured: false,
    })
    setShowModal(true)
  }

  function openEditModal(item) {
    setEditingItem(item)
    setFormData({
      client_name: item.client_name || '',
      client_role: item.client_role || '',
      client_location: item.client_location || '',
      content: item.content || '',
      rating: item.rating || 5,
      service_type: item.service_type || SERVICE_TYPES[0],
      is_published: item.is_published || false,
      is_featured: item.is_featured || false,
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    
    const submitData = {
      ...formData,
      client_name: formData.client_name.trim(),
      client_role: formData.client_role.trim(),
      client_location: formData.client_location.trim(),
      content: formData.content.trim(),
    }

    if (!submitData.client_name || !submitData.content) {
      toast.error('Client name and testimonial quote are required')
      return
    }

    let result
    if (editingItem) {
      result = await supabase.from('testimonials').update(submitData).eq('id', editingItem.id)
    } else {
      result = await supabase.from('testimonials').insert(submitData)
    }

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(editingItem ? 'Testimonial updated successfully' : 'Testimonial added successfully')
      setShowModal(false)
      fetchItems()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this? This cannot be undone.')) {
      return
    }

    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete testimonial')
    } else {
      toast.success('Testimonial deleted successfully')
      fetchItems()
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Client Reviews</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Testimonials</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Manage client testimonials and reviews.</p>
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
                  <th style={th}>Client Name</th>
                  <th style={th}>Role</th>
                  <th style={th}>Service</th>
                  <th style={th}>Rating</th>
                  <th style={th}>Published</th>
                  <th style={th}>Featured</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr 
                    key={item.id}
                    onClick={() => openEditModal(item)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.02)' }
                    onMouseLeave={e => e.target.style.background = 'transparent' }
                  >
                    <td style={{ ...td, color: '#fff', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {item.client_name}
                      {item.client_location && <div style={{ fontWeight: 'normal', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{item.client_location}</div>}
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{item.client_role}</td>
                    <td style={{ ...td, color: '#C9A227' }}>{item.service_type}</td>
                    <td style={td}>{'★'.repeat(item.rating || 5)}</td>
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
          title={editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Client Name *</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Role / Title</label>
              <input
                type="text"
                value={formData.client_role}
                onChange={(e) => handleInputChange('client_role', e.target.value)}
                placeholder="Founder, Export Company"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                value={formData.client_location}
                onChange={(e) => handleInputChange('client_location', e.target.value)}
                placeholder="Karachi, Pakistan"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Testimonial Quote *</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={5}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '120px',
                }}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                placeholder="What the client said..."
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                }}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              >
                {[5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{'★'.repeat(rating)} ({rating})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Service Type</label>
              <select
                value={formData.service_type}
                onChange={(e) => handleInputChange('service_type', e.target.value)}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                }}
                onFocus={e => e.target.style.borderColor = '#C9A227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              >
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                label="Featured on home page"
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