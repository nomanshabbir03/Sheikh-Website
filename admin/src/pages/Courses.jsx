// admin/src/pages/Courses.jsx
// Manage TGD courses — toggle published/featured

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)' }

export default function Courses() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, category, level, duration, modules, is_published, is_featured, is_free, badge_text, created_at')
      .order('created_at', { ascending: false })
    if (error) toast.error('Failed to load courses')
    else setItems(data || [])
    setLoading(false)
  }

  async function toggle(id, field, current) {
    const { error } = await supabase.from('courses').update({ [field]: !current }).eq('id', id)
    if (error) toast.error('Update failed')
    else {
      toast.success('Updated')
      setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: !current } : i))
    }
  }

  const Btn = ({ value, onToggle, onLabel, offLabel, color = '#10B981' }) => (
    <button onClick={onToggle} style={{
      padding: '4px 10px',
      background: value ? `${color}22` : 'rgba(255,255,255,0.06)',
      border: `1px solid ${value ? `${color}66` : 'rgba(255,255,255,0.12)'}`,
      color: value ? color : 'rgba(255,255,255,0.4)',
      borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', fontFamily: 'Arial, sans-serif',
    }}>
      {value ? onLabel : offLabel}
    </button>
  )

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>TGD Ecosystem</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Courses</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Toggle visibility. Edit full details in Supabase Table Editor.</p>
      </div>
      <div style={cardStyle}>
        {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Title</th>
                  <th style={th}>Category</th>
                  <th style={th}>Level</th>
                  <th style={th}>Duration</th>
                  <th style={th}>Modules</th>
                  <th style={th}>Free?</th>
                  <th style={th}>Published</th>
                  <th style={th}>Featured</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ ...td, color: '#fff', maxWidth: '240px' }}>
                      {item.title}
                      {item.badge_text && <span style={{ marginLeft: '8px', fontSize: '10px', background: 'rgba(201,162,39,0.2)', color: '#C9A227', padding: '2px 6px', borderRadius: '2px' }}>{item.badge_text}</span>}
                    </td>
                    <td style={{ ...td, color: '#C9A227' }}>{item.category}</td>
                    <td style={td}>{item.level}</td>
                    <td style={td}>{item.duration}</td>
                    <td style={td}>{item.modules}</td>
                    <td style={td}><Btn value={item.is_free} onToggle={() => toggle(item.id, 'is_free', item.is_free)} onLabel="Free" offLabel="Paid" color="#6366F1" /></td>
                    <td style={td}><Btn value={item.is_published} onToggle={() => toggle(item.id, 'is_published', item.is_published)} onLabel="Live" offLabel="Draft" /></td>
                    <td style={td}><Btn value={item.is_featured} onToggle={() => toggle(item.id, 'is_featured', item.is_featured)} onLabel="★ Yes" offLabel="No" color="#C9A227" /></td>
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