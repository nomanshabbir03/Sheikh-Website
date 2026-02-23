// admin/src/components/Sidebar.jsx
// Left sidebar with navigation links and branding

import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/',            label: 'Dashboard',    icon: '📊' },
  { path: '/contacts',    label: 'Contacts',     icon: '📩' },
  { path: '/bookings',    label: 'Bookings',     icon: '📅' },
  { path: '/insights',    label: 'Insights',     icon: '📝' },
  { path: '/courses',     label: 'TGD Courses',  icon: '🎓' },
  { path: '/testimonials',label: 'Testimonials', icon: '⭐' },
  { path: '/media',       label: 'Media',        icon: '🎙️' },
]

export default function Sidebar() {
  const { signOut, user } = useAuth()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#0D0D0D',
      borderRight: '1px solid rgba(201,162,39,0.15)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(201,162,39,0.15)',
      }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '2px',
        }}>
          Sheikh <span style={{ color: '#C9A227' }}>Ishtiaq</span>
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '10px',
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}>
          Admin Dashboard
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 20px',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
              textDecoration: 'none',
              color: isActive ? '#C9A227' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'rgba(201,162,39,0.08)' : 'transparent',
              borderLeft: isActive ? '3px solid #C9A227' : '3px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(201,162,39,0.15)',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '10px',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}>
          {user?.email}
        </div>
        <button
          onClick={signOut}
          style={{
            width: '100%',
            padding: '9px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            borderRadius: '2px',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}