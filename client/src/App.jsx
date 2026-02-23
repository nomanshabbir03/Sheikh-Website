// App.jsx
// Main app entry — defines all routes and wraps them in Layout

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Home       from './pages/Home'
import About      from './pages/About'
import Insights   from './pages/Insights'
import Consulting from './pages/Consulting'
import Visa       from './pages/Visa'
import TGD        from './pages/TGD'
import Media      from './pages/Media'
import Contact    from './pages/Contact'
import './styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#fff',
            border: '1px solid rgba(201,162,39,0.3)',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#C9A227', secondary: '#1A1A2E' },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/insights"   element={<Insights />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/visa"       element={<Visa />} />
          <Route path="/tgd"        element={<TGD />} />
          <Route path="/media"      element={<Media />} />
          <Route path="/contact"    element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}