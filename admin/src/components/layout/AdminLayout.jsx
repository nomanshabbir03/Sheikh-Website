// admin/src/components/AdminLayout.jsx
// Shell layout — sidebar left, page content right
// Uses React Router's Outlet for nested routes

import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111827' }}>
      <Sidebar />
      <main style={{
        marginLeft: '240px',
        flex: 1,
        padding: '32px',
        minHeight: '100vh',
        overflow: 'auto',
      }}>
        <Outlet />
      </main>
    </div>
  )
}