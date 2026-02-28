// admin/src/components/AdminLayout.jsx
// Shell layout — sidebar left, page content right
// Uses React Router's Outlet for nested routes

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#111827', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{
        marginLeft: '240px',
        width: 'calc(100vw - 240px)',
        minHeight: '100vh',
        padding: '32px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#111827'
      }}>
        <Outlet />
      </main>
    </div>
  )
}