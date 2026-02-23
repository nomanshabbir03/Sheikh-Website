// admin/src/pages/Contacts.jsx
// View and manage contact form submissions

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
  padding: '24px',
}

const th = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.35)',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
}

const td = {
  padding: '12px 14px',
  fontSize: '13px',
  color: 'rgba(255,255,255,0.75)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'top',
}

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchContacts() }, [])

  async function fetchContacts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) toast.error('Failed to load contacts')
    else setContacts(data || [])
    setLoading(false)
  }

  async function markRead(id) {
    const { error } = await supabase.from('contacts').update({ is_read: true }).eq('id', id)
    if (error) toast.error('Failed to update')
    else {
      toast.success('Marked as read')
      setContacts(prev => prev.map(c => c.id === id ? { ...c, is_read: true } : c))
      if (selected?.id === id) setSelected(prev => ({ ...prev, is_read: true }))
    }
  }

  const unread = contacts.filter(c => !c.is_read).length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Inbox</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>
            Contacts {unread > 0 && <span style={{ fontSize: '16px', color: '#C9A227', marginLeft: '8px' }}>({unread} unread)</span>}
          </h1>
        </div>
        <button onClick={fetchContacts} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '2px', cursor: 'pointer', fontSize: '13px' }}>
          ↻ Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div style={cardStyle}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p>
          ) : contacts.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No contacts yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Email</th>
                    <th style={th}>Purpose</th>
                    <th style={th}>Date</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      style={{ cursor: 'pointer', background: selected?.id === c.id ? 'rgba(201,162,39,0.06)' : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = selected?.id === c.id ? 'rgba(201,162,39,0.06)' : 'transparent'}
                    >
                      <td style={{ ...td, color: '#fff', fontWeight: c.is_read ? 'normal' : '700' }}>{c.full_name}</td>
                      <td style={td}>{c.email}</td>
                      <td style={td}>{c.purpose || '—'}</td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td style={td}>
                        {c.is_read
                          ? <span style={{ color: '#6B7280', fontSize: '12px' }}>Read</span>
                          : <span style={{ color: '#C9A227', fontSize: '12px', fontWeight: '700' }}>● New</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ ...cardStyle, borderLeft: '3px solid #C9A227' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff' }}>{selected.full_name}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            {[
              ['Email', selected.email],
              ['Purpose', selected.purpose],
              ['Location', [selected.city, selected.country].filter(Boolean).join(', ') || '—'],
              ['Date', new Date(selected.created_at).toLocaleString()],
            ].map(([l, v]) => (
              <div key={l} style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>{l}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{v}</p>
              </div>
            ))}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Message</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '2px' }}>{selected.message}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!selected.is_read && (
                <button onClick={() => markRead(selected.id)} style={{ padding: '9px 16px', background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.4)', color: '#C9A227', borderRadius: '2px', cursor: 'pointer', fontSize: '13px' }}>
                  ✓ Mark as Read
                </button>
              )}
              <a href={`mailto:${selected.email}`} style={{ padding: '9px 16px', background: '#C9A227', color: '#0D0D0D', borderRadius: '2px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}