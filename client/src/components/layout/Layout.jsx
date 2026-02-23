// Layout.jsx
// Wraps every page with Navbar on top and Footer on bottom
// padding-top on main is handled by globals.css using --navbar-h variable
// Do NOT add any extra paddingTop here — globals.css handles it sitewide

import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}