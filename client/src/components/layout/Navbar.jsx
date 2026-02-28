// Navbar.jsx
// Fixed navigation bar component with responsive hamburger menu
// Changed from named export to default export to fix the import error

import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'
import ConsultationPopup from '../ConsultationPopup'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isConsultationPopupOpen, setIsConsultationPopupOpen] = useState(false)
  const location = useLocation()
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navLinks = [
    { path: '/',           label: 'Home' },
    { path: '/about',      label: 'About' },
    { path: '/insights',   label: 'Insights' },
    { path: '/consulting', label: 'Consulting' },
    { path: '/visa',       label: 'Visa' },
    { path: '/tgd',        label: 'TGD' },
    { path: '/media',      label: 'Media' },
    { path: '/contact',    label: 'Contact' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu  = () => setIsMenuOpen(false)
  const toggleConsultationPopup = () => setIsConsultationPopupOpen(!isConsultationPopupOpen)

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <nav className={`${styles.navbar} ${isHidden ? styles.hidden : ''}`}>
        <div className={styles.navbarContent}>

          {/* Logo */}
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoText}>
              Sheikh <span className={styles.logoGold}>Ishtiaq</span>
            </span>
            <span className={styles.logoTagline}>The Growth Strategist</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`${styles.navLink} ${
                    location.pathname === link.path ? styles.active : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <button className={styles.ctaButton} onClick={toggleConsultationPopup}>
            Book Consultation
          </button>

          {/* Hamburger — mobile only */}
          <button
            className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

        </div>
      </nav>

      {/* ── MOBILE DROPDOWN MENU ── */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <ul className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`${styles.mobileNavLink} ${
                  location.pathname === link.path ? styles.mobileActive : ''
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className={styles.mobileCta}
              onClick={() => {
                toggleConsultationPopup()
                closeMenu()
              }}
            >
              Book Consultation →
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay — closes menu when clicking outside */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}
      
      {/* Consultation Popup */}
      <ConsultationPopup 
        isOpen={isConsultationPopupOpen} 
        onClose={() => setIsConsultationPopupOpen(false)} 
      />
    </>
  )
}