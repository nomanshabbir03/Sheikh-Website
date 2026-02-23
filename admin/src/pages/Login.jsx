// admin/src/pages/Login.jsx
// Admin login page — email/password via Supabase Auth

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail]       = useState('nomanshabbir03@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message || 'Login failed. Check your credentials.')
      setLoading(false)
    } else {
      toast.success('Welcome back!')
      // AuthContext detects session change — App.jsx redirects automatically
    }
  }

  const input = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '2px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1A2E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `
        linear-gradient(rgba(201,162,39,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,162,39,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            color: '#fff',
            marginBottom: '6px',
          }}>
            Sheikh <span style={{ color: '#C9A227' }}>Ishtiaq</span>
          </h1>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
          }}>
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(201,162,39,0.2)',
          borderRadius: '4px',
          padding: '36px 32px',
        }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: '#fff',
            marginBottom: '24px',
          }}>
            Sign In
          </h2>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '6px',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={input}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '6px',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={input}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? 'rgba(201,162,39,0.5)' : '#C9A227',
                color: '#0D0D0D',
                fontWeight: '700',
                fontSize: '14px',
                border: 'none',
                borderRadius: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Arial, sans-serif',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'monospace',
        }}>
          @imsheikhishtiaq — Restricted Access
        </p>
      </div>
    </div>
  )
}