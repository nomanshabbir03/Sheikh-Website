// Footer.jsx
// Main site footer with 9-platform strip and 4-column footer layout

import { Link, useLocation } from 'react-router-dom'
import styles from './Footer.module.css'
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaLinkedin, FaSnapchat, FaTwitter, FaGlobe } from 'react-icons/fa'

const platforms = [
  { icon: <FaFacebook />, name: 'Facebook',    handle: '@imsheikhishtiaq', url: '#' },
  { icon: <FaInstagram />, name: 'Instagram',   handle: '@imsheikhishtiaq', url: '#' },
  { icon: <FaWhatsapp />, name: 'WhatsApp',    handle: 'Channel',          url: '#' },
  { icon: <FaTiktok />, name: 'TikTok',      handle: '@imsheikhishtiaq', url: '#' },
  { icon: <FaYoutube />, name: 'YouTube',     handle: '18K+ Subs',        url: '#' },
  { icon: <FaLinkedin />, name: 'LinkedIn',    handle: '@imsheikhishtiaq', url: '#' },
  { icon: <FaSnapchat />, name: 'Snapchat',    handle: '@imsheikhishtiaq', url: '#' },
  { icon: <FaTwitter />, name: 'X (Twitter)', handle: '6K+ Followers',    url: '#' },
  { icon: <FaGlobe />, name: 'Website',     handle: 'imsheikhishtiaq.com', url: '#' },
]

export default function Footer() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  return (
    <>
      {/* ── 9-PLATFORM STRIP ── */}
      {isHomePage && (
        <div className={styles.platformStrip}>
          <span className={styles.platformStripTitle}>
            Follow @imsheikhishtiaq on all 9 platforms
          </span>
          <div className={styles.platformGrid}>
            {platforms.map((p) => (
              <a key={p.name} href={p.url} className={styles.platformCard}>
                <span className={styles.platformIcon}>{p.icon}</span>
                <span className={styles.platformName}>{p.name}</span>
                <span className={styles.platformHandle}>{p.handle}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>

          {/* Brand */}
          <div>
            <Link to="/" className={styles.footerLogo}>
              Sheikh <span>Ishtiaq</span>
            </Link>
            <span className={styles.footerHandle}>@imsheikhishtiaq</span>
            <p className={styles.footerBrandText}>
              The Growth Strategist — Geopolitics · Business · Global Mobility.
              Empowering professionals through the TGD ecosystem:
              Transform. Grow. Digitalize.
            </p>
          </div>

          {/* Navigate */}
          <div className={styles.footerCol}>
            <h5>Navigate</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/insights">Insights & Videos</Link></li>
              <li><Link to="/consulting">Consulting & Coaching</Link></li>
              <li><Link to="/visa">US Visa Consultancy</Link></li>
              <li><Link to="/tgd">TGD Courses</Link></li>
              <li><Link to="/media">Media / Gallery</Link></li>
              <li><Link to="/contact">Contact / Book</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerCol}>
            <h5>Services</h5>
            <ul>
              <li><Link to="/consulting">1-on-1 Strategy Session</Link></li>
              <li><Link to="/consulting">Structured Coaching Program</Link></li>
              <li><Link to="/consulting">Premium Advisory</Link></li>
              <li><Link to="/visa">US B1/B2 Visa Guidance</Link></li>
              <li><Link to="/tgd">TGD Online Courses</Link></li>
              <li><Link to="/tgd">Free Resources</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className={styles.footerCol}>
            <h5>Connect</h5>
            <ul>
              {platforms.map((p) => (
                <li key={p.name}>
                  <a href={p.url}>{p.icon} {p.name}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <span>
            © 2026 Sheikh Ishtiaq — The Growth Strategist ·{' '}
            <span className={styles.footerBottomHandle}>@imsheikhishtiaq</span>
            {' '}· All Rights Reserved
          </span>
          <span>
            <a href="#">Privacy Policy</a> · <a href="#">Disclaimer</a>
          </span>
        </div>
      </footer>
    </>
  )
}