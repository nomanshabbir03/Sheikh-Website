// AnimatedCounter.jsx
// Animated number counter component for impact statistics

import { useState, useEffect, useRef } from 'react'

export default function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Extract numeric value from target string (e.g., "500+" -> 500)
    const numericValue = parseInt(target.replace(/[^\d]/g, ''))
    const hasPlus = target.includes('+')
    const hasK = target.toUpperCase().includes('K')
    
    // Convert to actual number
    let actualTarget = numericValue
    if (hasK) {
      actualTarget = numericValue * 1000
    }

    const increment = actualTarget / (duration / 16) // 60fps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= actualTarget) {
        current = actualTarget
        clearInterval(timer)
      }
      
      // Format the display number
      let displayValue = Math.floor(current)
      if (hasK) {
        displayValue = (current / 1000).toFixed(1)
      }
      
      setCount(displayValue)
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  // Format the final display
  const formatDisplay = (value) => {
    const hasPlus = target.includes('+')
    const hasK = target.toUpperCase().includes('K')
    
    let display = value.toString()
    if (hasK && !display.includes('.')) {
      display = display + 'K'
    } else if (hasK && display.includes('.')) {
      display = parseFloat(display).toFixed(1) + 'K'
    }
    
    if (hasPlus) {
      display = display + '+'
    }
    
    return display + suffix
  }

  return (
    <span ref={counterRef}>
      {formatDisplay(count)}
    </span>
  )
}
