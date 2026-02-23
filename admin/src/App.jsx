// admin/src/App.jsx
// Admin dashboard routing — all routes protected except /login
// Redirects to /login if not authenticated

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Contacts     from './pages/Contacts'
import Bookings     from './pages/Bookings'
import Insights     from './pages/Insights'
import Courses      from './pages/Courses'
import Testimonials from './pages/Testimonials'
import Media        from './pages/Media'

// Layout
import AdminLayout  from './components/AdminLayout'

// ── Protected route wrapper ──
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#1A1A2E', color: '#C9A227',
        fontFamily: 'monospace', fontSize: '14px', letterSpacing: '2px'
      }}>
        LOADING...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}

// ── App with routes ──
function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected — all wrapped in AdminLayout */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index          element={<Dashboard />} />
        <Route path="contacts"     element={<Contacts />} />
        <Route path="bookings"     element={<Bookings />} />
        <Route path="insights"     element={<Insights />} />
        <Route path="courses"      element={<Courses />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="media"        element={<Media />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              color: '#fff',
              border: '1px solid rgba(201,162,39,0.3)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#C9A227', secondary: '#1A1A2E' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}