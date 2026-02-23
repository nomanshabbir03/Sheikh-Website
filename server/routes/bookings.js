// server/routes/bookings.js
// Booking form routes with validation

import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  submitBooking,
  listBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js'

const router = Router()

// ── Validation rules for booking form ──
const bookingValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('service_type')
    .trim()
    .notEmpty().withMessage('Please select a service type'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 7, max: 20 }).withMessage('Please enter a valid phone number'),

  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Message must be under 1000 characters'),
]

// ── Routes ──
router.post('/', bookingValidation, validateRequest, submitBooking)
router.get('/', listBookings)
router.patch('/:id/status', updateBookingStatus)

export default router