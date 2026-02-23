// server/index.js
// Main Express server entry point
// All middleware, routes, and error handling registered here

import express    from 'express'
import cors       from 'cors'
import helmet     from 'helmet'
import morgan     from 'morgan'
import dotenv     from 'dotenv'
import { supabase } from './config/supabase.js'

// Routes
import contactRoutes  from './routes/contact.js'
import bookingRoutes  from './routes/bookings.js'
import insightRoutes  from './routes/insights.js'
import courseRoutes   from './routes/courses.js'

// Middleware
import { errorHandler } from './middleware/errorHandler.js'

// Load env vars
dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ══════════════════════════════════════
// MIDDLEWARE
// ══════════════════════════════════════

// Security headers
app.use(helmet())

// CORS — allow client and admin origins
app.use(cors({
  origin: [
    process.env.CLIENT_URL  || 'http://localhost:5173',
    process.env.ADMIN_URL   || 'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}))

// Request logging
app.use(morgan('dev'))

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ══════════════════════════════════════
// HEALTH CHECK ROUTES
// ══════════════════════════════════════

// Basic health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Sheikh Ishtiaq API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
})

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, client_name')
      .limit(3)

    if (error) throw error

    res.json({
      success: true,
      message: 'Supabase connection healthy',
      sample: data,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: err.message,
    })
  }
})

// ══════════════════════════════════════
// API ROUTES
// ══════════════════════════════════════

app.use('/api/contact',  contactRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/insights', insightRoutes)
app.use('/api/courses',  courseRoutes)

// ── 404 handler for unknown routes ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  })
})

// ── Global error handler (must be last) ──
app.use(errorHandler)

// ══════════════════════════════════════
// START SERVER
// ══════════════════════════════════════

app.listen(PORT, () => {
  console.log('')
  console.log('  ┌─────────────────────────────────────────┐')
  console.log(`  │  Sheikh Ishtiaq API running on :${PORT}   │`)
  console.log('  │  @imsheikhishtiaq — The Growth Strategist│')
  console.log('  └─────────────────────────────────────────┘')
  console.log('')
  console.log(`  GET  http://localhost:${PORT}/health`)
  console.log(`  GET  http://localhost:${PORT}/health/db`)
  console.log(`  POST http://localhost:${PORT}/api/contact`)
  console.log(`  POST http://localhost:${PORT}/api/bookings`)
  console.log(`  GET  http://localhost:${PORT}/api/insights`)
  console.log(`  GET  http://localhost:${PORT}/api/courses`)
  console.log('')
})

export default app