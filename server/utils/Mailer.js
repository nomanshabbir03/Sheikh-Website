// server/utils/mailer.js
// Nodemailer utility — sends email notifications on contact & booking submissions
// Uses Gmail SMTP. Set EMAIL_USER and EMAIL_PASS in server/.env
// If credentials not set, logs a warning and skips silently

import nodemailer from 'nodemailer'

// ── Create transporter (lazy — only connects when needed) ──
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER.includes('placeholder')) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Gmail App Password, not your main password
    },
  })
}

// ── Contact form notification ──
export async function sendContactNotification({ full_name, email, purpose, city, country, message }) {
  const transporter = getTransporter()
  if (!transporter) {
    console.log('📧 Email skipped — EMAIL_USER/EMAIL_PASS not configured yet')
    return
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1A1A2E; padding: 24px; border-bottom: 3px solid #C9A227;">
        <h2 style="color: #C9A227; margin: 0;">New Contact Form Submission</h2>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0;">Sheikh Ishtiaq — @imsheikhishtiaq</p>
      </div>
      <div style="background: #f9fafb; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 120px;">Name</td>
              <td style="padding: 8px 0; font-weight: 700; color: #1A1A2E;">${full_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Email</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Purpose</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${purpose || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Location</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${[city, country].filter(Boolean).join(', ') || '—'}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: white; border-left: 3px solid #C9A227; border-radius: 2px;">
          <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <p style="color: #1A1A2E; margin: 0; line-height: 1.6;">${message}</p>
        </div>
      </div>
      <div style="background: #1A1A2E; padding: 16px 24px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
          Received via imsheikhishtiaq.com contact form
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Sheikh Ishtiaq Website" <${process.env.EMAIL_USER}>`,
    to:   process.env.EMAIL_USER,
    replyTo: email,
    subject: `📩 New Contact: ${full_name} — ${purpose || 'General Enquiry'}`,
    html,
  })

  console.log(`📧 Contact notification sent for: ${full_name}`)
}

// ── Booking notification ──
export async function sendBookingNotification({
  full_name, email, phone, service_type, package: pkg,
  preferred_date, preferred_time, city, country, message,
}) {
  const transporter = getTransporter()
  if (!transporter) {
    console.log('📧 Email skipped — EMAIL_USER/EMAIL_PASS not configured yet')
    return
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1A1A2E; padding: 24px; border-bottom: 3px solid #C9A227;">
        <h2 style="color: #C9A227; margin: 0;">New Consultation Booking</h2>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0;">Sheikh Ishtiaq — @imsheikhishtiaq</p>
      </div>
      <div style="background: #f9fafb; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 140px;">Name</td>
              <td style="padding: 8px 0; font-weight: 700; color: #1A1A2E;">${full_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Email</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Phone</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${phone || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Service</td>
              <td style="padding: 8px 0; color: #C9A227; font-weight: 700;">${service_type || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Package</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${pkg || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Preferred Date</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${preferred_date || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Preferred Time</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${preferred_time || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Location</td>
              <td style="padding: 8px 0; color: #1A1A2E;">${[city, country].filter(Boolean).join(', ') || '—'}</td></tr>
        </table>
        ${message ? `
        <div style="margin-top: 16px; padding: 16px; background: white; border-left: 3px solid #C9A227; border-radius: 2px;">
          <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Additional Notes</p>
          <p style="color: #1A1A2E; margin: 0; line-height: 1.6;">${message}</p>
        </div>` : ''}
      </div>
      <div style="background: #1A1A2E; padding: 16px 24px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
          Received via imsheikhishtiaq.com booking form
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Sheikh Ishtiaq Website" <${process.env.EMAIL_USER}>`,
    to:   process.env.EMAIL_USER,
    replyTo: email,
    subject: `📅 New Booking: ${full_name} — ${service_type || 'Consultation'}`,
    html,
  })

  console.log(`📧 Booking notification sent for: ${full_name}`)
}