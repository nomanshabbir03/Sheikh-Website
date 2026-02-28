import React, { useState } from 'react'
import { FaWhatsapp, FaEnvelope, FaTimes } from 'react-icons/fa'
import './ConsultationPopup.css'

const ConsultationPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/923365116800', '_blank')
    onClose()
  }

  const handleEmailClick = () => {
    window.open('mailto:consult@sheikhishtiaq.com', '_blank')
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div className="consultation-overlay" onClick={onClose} />
      
      {/* Popup */}
      <div className="consultation-popup">
        <button className="consultation-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h3 className="consultation-title">Book Consultation</h3>
        
        <div className="consultation-options">
          <button className="consultation-option whatsapp-option" onClick={handleWhatsAppClick}>
            <FaWhatsapp className="consultation-icon" />
            <span>WhatsApp</span>
          </button>
          
          <button className="consultation-option email-option" onClick={handleEmailClick}>
            <FaEnvelope className="consultation-icon" />
            <span>Email</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ConsultationPopup
