// admin/src/pages/Insights.jsx
// Manage blog posts — toggle published, view list

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)' }

export default function Insights() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('insights').select('id, title, category, is_published, is_featured, views, created_at')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load insights')
    else setItems(data || [])
    setLoading(false)
  }

  async function togglePublished(id, current) {
    const { error } = await supabase.from('insights').update({ is_published: !current }).eq('id', id)
    if (error) toast.error('Update failed')
    else {
      toast.success(!current ? 'Published' : 'Unpublished')
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_published: !current } : i))
    }
  }

  async function toggleFeatured(id, current) {
    const { error } = await supabase.from('insights').update({ is_featured: !current }).eq('id', id)
    if (error) toast.error('Update failed')
    else {
      toast.success(!current ? 'Marked as featured' : 'Removed from featured')
      setItems(prev => prev.map(i => i.id === id ? { ...i, is_featured: !current } : i))
    }
  }

  const Toggle = ({ value, onToggle, onLabel, offLabel }) => (
    <button onClick={onToggle} style={{
      padding: '4px 10px',
      background: value ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${value ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
      color: value ? '#10B981' : 'rgba(255,255,255,0.4)',
      borderRadius: '2px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '700',
      fontFamily: 'Arial, sans-serif',
    }}>
      {value ? onLabel : offLabel}
    </button>
  )

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Content</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Insights & Posts</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Manage blog posts. Edit content directly in Supabase Table Editor.</p>
      </div>
      <div style={cardStyle}>
        {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Category</th>
                  <th style={th}>Views</th>
                  <th style={th}>Published</th>
                  <th style={th}>Featured</th>
                  <th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ ...td, color: '#fff', maxWidth: '280px' }}>{item.title}</td>
                    <td style={{ ...td, color: '#C9A227' }}>{item.category}</td>
                    <td style={td}>{item.views || 0}</td>
                    <td style={td}>
                      <Toggle value={item.is_published} onToggle={() => togglePublished(item.id, item.is_published)} onLabel="Live" offLabel="Draft" />
                    </td>
                    <td style={td}>
                      <Toggle value={item.is_featured} onToggle={() => toggleFeatured(item.id, item.is_featured)} onLabel="★ Yes" offLabel="No" />
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{new Date(item.created_at).toLocaleDateString()}</td>
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