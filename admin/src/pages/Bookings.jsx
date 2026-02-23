// admin/src/pages/Bookings.jsx
// Manage consultation booking requests with status updates

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace', whiteSpace: 'nowrap' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top' }

const STATUS_COLORS = {
  pending:   '#F59E0B',
  confirmed: '#10B981',
  completed: '#6B7280',
  cancelled: '#EF4444',
}

function StatusBadge({ status }) {
  return (
    <span style={{
      padding: '3px 10px',
      background: `${STATUS_COLORS[status] || '#6B7280'}22`,
      color: STATUS_COLORS[status] || '#6B7280',
      borderRadius: '2px',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {status}
    </span>
  )
}

export default function Bookings() {
  const [bookings, setBookings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)
  const [filter, setFilter]       = useState('all')

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings').select('*').order('created_at', { ascending: false })
    if (error) toast.error('Failed to load bookings')
    else setBookings(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('bookings').update({ status, is_read: true }).eq('id', id)
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Booking marked as ${status}`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status, is_read: true } : b))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status, is_read: true }))
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const pending  = bookings.filter(b => b.status === 'pending').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>Consultation Requests</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>
            Bookings {pending > 0 && <span style={{ fontSize: '16px', color: '#F59E0B', marginLeft: '8px' }}>({pending} pending)</span>}
          </h1>
        </div>
        <button onClick={fetchBookings} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '2px', cursor: 'pointer', fontSize: '13px' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px',
            background: filter === s ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${filter === s ? 'rgba(201,162,39,0.5)' : 'rgba(255,255,255,0.08)'}`,
            color: filter === s ? '#C9A227' : 'rgba(255,255,255,0.5)',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            textTransform: 'capitalize',
            fontFamily: 'Arial, sans-serif',
          }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div style={cardStyle}>
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No bookings found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Service</th>
                    <th style={th}>Package</th>
                    <th style={th}>Date</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id} onClick={() => setSelected(b)} style={{ cursor: 'pointer', background: selected?.id === b.id ? 'rgba(201,162,39,0.06)' : 'transparent' }}>
                      <td style={{ ...td, color: '#fff', fontWeight: '700' }}>{b.full_name}</td>
                      <td style={td}>{b.service_type || '—'}</td>
                      <td style={td}>{b.package || '—'}</td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                      <td style={td}><StatusBadge status={b.status} /></td>
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
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            {[
              ['Email',    selected.email],
              ['Phone',    selected.phone],
              ['Service',  selected.service_type],
              ['Package',  selected.package],
              ['Preferred Date', selected.preferred_date],
              ['Preferred Time', selected.preferred_time],
              ['Location', [selected.city, selected.country].filter(Boolean).join(', ') || '—'],
            ].map(([l, v]) => v ? (
              <div key={l} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{l}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{v}</p>
              </div>
            ) : null)}
            {selected.message && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Notes</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '2px' }}>{selected.message}</p>
              </div>
            )}
            {/* Status buttons */}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Update Status</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['confirmed', 'completed', 'cancelled'].map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                  padding: '7px 14px',
                  background: `${STATUS_COLORS[s]}22`,
                  border: `1px solid ${STATUS_COLORS[s]}66`,
                  color: STATUS_COLORS[s],
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  fontFamily: 'Arial, sans-serif',
                }}>
                  {s}
                </button>
              ))}
            </div>
            <a href={`mailto:${selected.email}`} style={{ display: 'block', padding: '10px', background: '#C9A227', color: '#0D0D0D', borderRadius: '2px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>
              Reply via Email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}