// admin/src/pages/Media.jsx
// Manage media gallery items — toggle published

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)' }

const TYPE_COLORS = {
  Podcast: '#8B5CF6', Speech: '#F59E0B', Event: '#10B981',
  Interview: '#3B82F6', Webinar: '#EC4899', Press: '#EF4444', Photo: '#14B8A6',
}

export default function Media() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('media_gallery')
      .select('id, title, media_type, event_name, event_date, is_published, created_at')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load media')
    else setItems(data || [])
    setLoading(false)
  }

  async function togglePublished(id, current) {
    const { error } = await supabase.from('media_gallery').update({ is_published: !current }).eq('id', id)
    if (error) toast.error('Update failed')
    else {
      toast.success(!current ? 'Published' : 'Hidden')
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_published: !current } : i))
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Appearances & Press</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Media Gallery</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Toggle which appearances show on the website. Edit details in Supabase.</p>
      </div>
      <div style={cardStyle}>
        {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Type</th>
                  <th style={th}>Event</th>
                  <th style={th}>Date</th>
                  <th style={th}>Published</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ ...td, color: '#fff', maxWidth: '240px' }}>{item.title}</td>
                    <td style={td}>
                      <span style={{
                        padding: '3px 10px',
                        background: `${TYPE_COLORS[item.media_type] || '#6B7280'}22`,
                        color: TYPE_COLORS[item.media_type] || '#6B7280',
                        borderRadius: '2px', fontSize: '11px', fontWeight: '700',
                      }}>
                        {item.media_type}
                      </span>
                    </td>
                    <td style={td}>{item.event_name || '—'}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{item.event_date ? new Date(item.event_date).toLocaleDateString() : '—'}</td>
                    <td style={td}>
                      <button onClick={() => togglePublished(item.id, item.is_published)} style={{
                        padding: '4px 10px',
                        background: item.is_published ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${item.is_published ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
                        color: item.is_published ? '#10B981' : 'rgba(255,255,255,0.4)',
                        borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', fontFamily: 'Arial, sans-serif',
                      }}>
                        {item.is_published ? 'Live' : 'Hidden'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}