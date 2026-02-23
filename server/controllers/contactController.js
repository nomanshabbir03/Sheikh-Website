// contactController.js
// Handles contact form submissions
// Saves to Supabase contacts table + sends email notification

import { supabase } from '../config/supabase.js'
import { sendContactNotification } from '../utils/Mailer.js'

// POST /api/contact
export async function submitContact(req, res, next) {
  try {
    const {
      full_name,
      email,
      purpose,
      city,
      country,
      message,
    } = req.body

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        full_name,
        email,
        purpose,
        city:    city    || null,
        country: country || null,
        message,
      }])
      .select()
      .single()

    if (error) throw error

    // 2. Send email notification (non-blocking — don't fail if email fails)
    try {
      await sendContactNotification({ full_name, email, purpose, city, country, message })
    } catch (emailErr) {
      console.warn('⚠️  Email notification failed (submission still saved):', emailErr.message)
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. Sheikh Ishtiaq will respond within 24-48 hours.',
      id: data.id,
    })

  } catch (err) {
    next(err)
  }
}

// GET /api/contact — list all (admin only, requires service key)
export async function listContacts(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.json({
      success: true,
      count: data.length,
      data,
    })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/contact/:id/read — mark as read
export async function markContactRead(req, res, next) {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('contacts')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw error

    return res.json({ success: true, message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
}