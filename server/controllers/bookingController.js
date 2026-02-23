// bookingController.js
// Handles consultation booking requests
// Saves to Supabase bookings table + sends email notification

import { supabase } from '../config/supabase.js'
import { sendBookingNotification } from '../utils/mailer.js'

// POST /api/bookings
export async function submitBooking(req, res, next) {
  try {
    const {
      full_name,
      email,
      phone,
      service_type,
      package: pkg,
      preferred_date,
      preferred_time,
      city,
      country,
      message,
    } = req.body

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        full_name,
        email,
        phone:          phone          || null,
        service_type,
        package:        pkg,
        preferred_date: preferred_date || null,
        preferred_time: preferred_time || null,
        city:           city           || null,
        country:        country        || null,
        message:        message        || null,
        status:         'pending',
      }])
      .select()
      .single()

    if (error) throw error

    // 2. Send email notification (non-blocking)
    try {
      await sendBookingNotification({
        full_name, email, phone, service_type,
        package: pkg, preferred_date, preferred_time,
        city, country, message,
      })
    } catch (emailErr) {
      console.warn('⚠️  Email notification failed (booking still saved):', emailErr.message)
    }

    return res.status(201).json({
      success: true,
      message: 'Booking request received. Sheikh Ishtiaq will confirm your appointment within 24 hours.',
      id: data.id,
    })

  } catch (err) {
    next(err)
  }
}

// GET /api/bookings — list all bookings (admin)
export async function listBookings(req, res, next) {
  try {
    const { status } = req.query

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
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

// PATCH /api/bookings/:id/status — update booking status
export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status, is_read: true })
      .eq('id', id)

    if (error) throw error

    return res.json({ success: true, message: `Booking marked as ${status}` })
  } catch (err) {
    next(err)
  }
}