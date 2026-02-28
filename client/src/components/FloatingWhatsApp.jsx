import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import './FloatingWhatsApp.css'

const FloatingWhatsApp = () => {
  const handleClick = () => {
    window.open('https://wa.me/923365116800', '_blank')
  }

  return (
    <div className="floating-whatsapp">
      <div className="whatsapp-button" onClick={handleClick}>
        <FaWhatsapp size={28} />
        <span className="tooltip">Chat with us</span>
      </div>
    </div>
  )
}

export default FloatingWhatsApp
