// admin/src/pages/Dashboard.jsx
// Overview page — live stats from all 8 Supabase tables

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
  padding: '24px',
}

function StatCard({ label, count, icon, to, color = '#C9A227' }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        ...cardStyle,
        borderTop: `3px solid ${color}`,
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '36px',
          fontWeight: '700',
          color,
          lineHeight: 1,
          marginBottom: '6px',
        }}>
          {count ?? '—'}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.5px',
        }}>
          {label}
        </div>
      </div>
    </Link>
  )
}

function RecentRow({ items, columns }) {
  if (!items.length) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '20px 0' }}>
        No records yet.
      </p>
    )
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key} style={{
              textAlign: 'left',
              padding: '10px 12px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'monospace',
            }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((row, i) => (
          <tr key={i}>
            {columns.map(c => (
              <td key={c.key} style={{
                padding: '10px 12px',
                fontSize: '13px',
                color: c.gold ? '#C9A227' : 'rgba(255,255,255,0.7)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontWeight: c.gold ? '700' : 'normal',
              }}>
                {c.render ? c.render(row[c.key], row) : (row[c.key] || '—')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Dashboard() {
  const [stats, setStats]           = useState({})
  const [recentContacts, setContacts] = useState([])
  const [recentBookings, setBookings] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const tables = ['contacts', 'bookings', 'insights', 'videos', 'courses', 'testimonials', 'media_gallery', 'subscribers']

        const counts = {}
        await Promise.all(tables.map(async t => {
          const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
          counts[t] = count ?? 0
        }))
        setStats(counts)

        const { data: contacts } = await supabase
          .from('contacts').select('full_name, email, purpose, created_at')
          .order('created_at', { ascending: false }).limit(5)
        setContacts(contacts || [])

        const { data: bookings } = await supabase
          .from('bookings').select('full_name, email, service_type, status, created_at')
          .order('created_at', { ascending: false }).limit(5)
        setBookings(bookings || [])

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const heading = t => (
    <h2 style={{
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#fff',
      marginBottom: '16px',
    }}>{t}</h2>
  )

  const statusBadge = status => {
    const colors = {
      pending:   '#F59E0B',
      confirmed: '#10B981',
      completed: '#6B7280',
      cancelled: '#EF4444',
    }
    return (
      <span style={{
        padding: '3px 10px',
        background: `${colors[status] || '#6B7280'}22`,
        color: colors[status] || '#6B7280',
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

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '8px' }}>
          Overview
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#fff', marginBottom: '4px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          Sheikh Ishtiaq — @imsheikhishtiaq
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>
          LOADING STATS...
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '40px',
        }}>
          <StatCard label="Total Contacts"     count={stats.contacts}     icon="📩" to="/contacts"     />
          <StatCard label="Bookings"           count={stats.bookings}     icon="📅" to="/bookings"     color="#10B981" />
          <StatCard label="Insights"           count={stats.insights}     icon="📝" to="/insights"     color="#6366F1" />
          <StatCard label="Subscribers"        count={stats.subscribers}  icon="📧" to="/"            color="#EC4899" />
          <StatCard label="TGD Courses"        count={stats.courses}      icon="🎓" to="/courses"      color="#F59E0B" />
          <StatCard label="Testimonials"       count={stats.testimonials} icon="⭐" to="/testimonials" color="#EF4444" />
          <StatCard label="Media Items"        count={stats.media_gallery}icon="🎙️" to="/media"        color="#14B8A6" />
          <StatCard label="Videos"             count={stats.videos}       icon="▶️" to="/"            color="#8B5CF6" />
        </div>
      )}

      {/* Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Recent contacts */}
        <div style={cardStyle}>
          {heading('Recent Contacts')}
          <RecentRow
            items={recentContacts}
            columns={[
              { key: 'full_name', label: 'Name', gold: true },
              { key: 'purpose',   label: 'Purpose' },
              { key: 'created_at', label: 'Date', render: v => new Date(v).toLocaleDateString() },
            ]}
          />
          <Link to="/contacts" style={{ display: 'inline-block', marginTop: '14px', fontSize: '12px', color: '#C9A227', textDecoration: 'none' }}>
            View all contacts →
          </Link>
        </div>

        {/* Recent bookings */}
        <div style={cardStyle}>
          {heading('Recent Bookings')}
          <RecentRow
            items={recentBookings}
            columns={[
              { key: 'full_name',    label: 'Name', gold: true },
              { key: 'service_type', label: 'Service' },
              { key: 'status',       label: 'Status', render: v => statusBadge(v) },
            ]}
          />
          <Link to="/bookings" style={{ display: 'inline-block', marginTop: '14px', fontSize: '12px', color: '#C9A227', textDecoration: 'none' }}>
            View all bookings →
          </Link>
        </div>

      </div>
    </div>
  )
}