// server/routes/contact.js
// Contact form routes with validation

import { Router } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middleware/validateRequest.js'
import {
  submitContact,
  listContacts,
  markContactRead,
} from '../controllers/contactController.js'

const router = Router()

// ── Validation rules for contact form ──
const contactValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('purpose')
    .trim()
    .notEmpty().withMessage('Please select a purpose'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
]

// ── Routes ──
router.post('/', contactValidation, validateRequest, submitContact)
router.get('/', listContacts)
router.patch('/:id/read', markContactRead)

export default router