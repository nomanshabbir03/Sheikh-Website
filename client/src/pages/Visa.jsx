// Visa.jsx
// US B1/B2 Visa Consultancy page
// Includes disclaimer, who-for list, included services, process steps, FAQ accordion, sidebar CTA

import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Visa.module.css'

// ── Who this helps ──
const whoList = [
  'First-time US visit visa applicants needing structured preparation',
  'Previous refusal cases seeking a professional case review',
  'Family visit applications requiring documentation guidance',
  'Business travel applicants (B1) navigating complex requirements',
]

// ── What's included ──
const included = [
  'DS-160 form guidance',
  'Interview preparation',
  'Documentation review',
  'Case strength assessment',
  'Refusal letter analysis',
  'Mock interview sessions',
  'Pre-appointment briefing',
  'WhatsApp support throughout',
]

// ── Process steps ──
const steps = [
  {
    num: '1',
    title: 'Initial Case Assessment',
    desc: 'Submit your situation. Sheikh Ishtiaq evaluates ties, finances, travel history, and overall case strength.',
  },
  {
    num: '2',
    title: 'Documentation Review',
    desc: 'Go through your documents — identifying gaps, inconsistencies, and areas to strengthen before submission.',
  },
  {
    num: '3',
    title: 'Interview Preparation',
    desc: 'Live mock interview with coaching on framing, consistency, and responding confidently under pressure.',
  },
  {
    num: '4',
    title: 'Pre-Appointment Briefing',
    desc: 'Final check-in before your appointment to ensure you walk in prepared and composed.',
  },
]

// ── FAQ items ──
const faqs = [
  {
    q: 'How long does the process take?',
    a: 'Typically 1–3 sessions over 1–2 weeks, depending on your timeline and case complexity.',
  },
  {
    q: 'I was previously refused. Can you still help?',
    a: 'Yes. Refusal cases are a speciality. We analyse the refusal grounds, address weaknesses, and prepare a significantly stronger reapplication.',
  },
  {
    q: 'Do you guarantee visa approval?',
    a: 'No. Nobody can legally or ethically guarantee a visa outcome. What Sheikh Ishtiaq guarantees is the best professional preparation of your case.',
  },
  {
    q: 'What documents do I need to share?',
    a: 'Bank statements, employment letters, property documents (if applicable), prior visa history, and purpose of visit documentation.',
  },
  {
    q: 'Is this service confidential?',
    a: 'Absolutely. All case information shared with Sheikh Ishtiaq is treated with complete confidentiality.',
  },
]

// ── Sidebar services ──
const sidebarServices = [
  'DS-160 complete guidance',
  'Document checklist review',
  'Mock interview (live session)',
  'Case strength assessment report',
  'Pre-appointment briefing call',
  'WhatsApp support throughout',
]

// ── Stats ──
const stats = [
  { num: '500+', label: 'Cases Reviewed' },
  { num: '94%',  label: 'Success Rate' },
  { num: '40+',  label: 'Countries' },
  { num: '12+',  label: 'Years Exp.' },
]

// ══════════════════════════════════════════════
// VISA PAGE COMPONENT
// ══════════════════════════════════════════════
export default function Visa() {
  const [openFaq, setOpenFaq] = useState(null)

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <>
      {/* ─── PAGE HEADER ─── */}
      <div className="page-header">
        <div className="page-header-glow" />
        <div className="page-header-inner">
          <span className="eyebrow">US B1/B2 Visa Consultancy</span>
          <h1 className="display-title" style={{ color: 'var(--white)' }}>
            Professional Guidance for<br />
            US Visit Visa <em>Applicants.</em>
          </h1>
          <p className={styles.headerSub}>
            Expert preparation for first-time applicants, refusal cases, and
            business visitors — with the clarity and structure that gives your
            application the best possible chance.
          </p>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <section className={styles.visaSection}>
        <div className="container">
          <div className={styles.visaLayout}>

            {/* ── Main Column ── */}
            <div>

              {/* Disclaimer */}
              <div className={styles.disclaimer}>
                <span className={styles.disclaimerIcon}>⚠️</span>
                <p className={styles.disclaimerText}>
                  <strong>Important Disclaimer:</strong> All services provided are
                  guidance and preparation only. Sheikh Ishtiaq is not a licensed
                  immigration attorney. No outcome or approval can be guaranteed.
                  Final decisions rest entirely with the US Embassy / Consulate.
                  This is independent advisory — not legal representation.
                </p>
              </div>

              {/* Who this helps */}
              <h3 className={styles.subHeading}>Who This Helps</h3>
              <ul className={styles.whoList}>
                {whoList.map((item) => (
                  <li key={item}>
                    <span className={styles.whoArrow}>→</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* What's included */}
              <h3 className={styles.subHeading}>What Sheikh Ishtiaq Provides</h3>
              <div className={styles.includedGrid}>
                {included.map((item) => (
                  <div key={item} className={styles.includedItem}>
                    <span className={styles.includedCheck}>✓</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Process steps */}
              <h3 className={styles.subHeading}>Process Flow</h3>
              <div className={styles.stepsList}>
                {steps.map((step) => (
                  <div key={step.num} className={styles.stepRow}>
                    <div className={styles.stepBubble}>{step.num}</div>
                    <div className={styles.stepBody}>
                      <h5>{step.title}</h5>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <h3 className={styles.subHeading}>Frequently Asked Questions</h3>
              <div className={styles.faqList}>
                {faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem} onClick={() => toggleFaq(i)}>
                    <div className={styles.faqQuestion}>
                      <span>{faq.q}</span>
                      <span className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ''}`}>
                        +
                      </span>
                    </div>
                    <div className={`${styles.faqAnswer} ${openFaq === i ? styles.faqAnswerOpen : ''}`}>
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ── Sidebar ── */}
            <div className={styles.sidebar}>

              {/* CTA Card */}
              <div className={styles.ctaCard}>
                <h3>Start Your Assessment</h3>
                <p>
                  Tell Sheikh Ishtiaq about your case. He'll review your situation
                  and build a plan from there.
                </p>
                <Link to="/contact" className={styles.btnDarkFull}>
                  Begin Assessment →
                </Link>
              </div>

              {/* Stats */}
              <div className={styles.statsBox}>
                {stats.map((s) => (
                  <div key={s.label} className={styles.statItem}>
                    <span className={styles.statNum}>{s.num}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Services included */}
              <div className={styles.servicesBox}>
                <h4>What's Included</h4>
                {sidebarServices.map((s) => (
                  <div key={s} className={styles.serviceItem}>
                    <div className={styles.serviceDot} />
                    {s}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <div className={styles.ctaBanner}>
        <h2>Ready to Get Started?</h2>
        <p>
          Don't leave your visa application to chance. Get professional preparation
          from Sheikh Ishtiaq and walk into that interview with confidence.
        </p>
        <Link to="/contact" className="btn-gold">
          Book Your Visa Consultation →
        </Link>
      </div>
    </>
  )
}