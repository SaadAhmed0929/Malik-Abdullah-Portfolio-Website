import { useState } from 'react'
import { useFadeIn } from '../hooks/useAnimations'

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
)

export default function Contact() {
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [sending, setSending] = useState(false)
  useFadeIn([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
      botcheck: e.target.botcheck?.value || '',
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        e.target.reset()
      } else {
        const data = await response.json().catch(() => ({}))
        setStatus(data.error || 'error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus('error')
    } finally {
      setSending(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  return (
    <div className="contact-section">
      {/* Header */}
      <div className="contact-header fade-in">
        <h1 className="contact-title">Contact</h1>
        <div className="section-divider" />
      </div>

      <div className="contact-grid">
        {/* Info */}
        <div className="contact-info fade-in fade-in--d1">
          <p className="contact-tagline">
            I'm always open to discussing new engineering challenges, systems architecture,
            game development, or high-impact collaborations.
          </p>

          <div className="contact-details">
            {[
              { label: 'Email', value: 'muhammad.abdullah1388924@gmail.com', href: 'mailto:muhammad.abdullah1388924@gmail.com' },
              { label: 'Phone / WhatsApp', value: '(+92) 370-4994954', href: 'https://wa.me/923704994954' },
              { label: 'LinkedIn', value: '@muhammad-abdullah', href: 'https://www.linkedin.com/in/muhammad-abdullah-622a663a1/' },
              { label: 'Instagram', value: '@__.m.abdullah', href: 'https://www.instagram.com/__.m.abdullah/' },
            ].map(({ label, value, href }) => (
              <div key={label} className="fade-in">
                <p className="contact-detail__label">{label}</p>
                <a
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="contact-detail__value"
                >
                  {value}
                </a>
              </div>
            ))}
          </div>

          <div className="contact-location fade-in">
            <p className="contact-detail__label">Location</p>
            <p className="contact-detail__value" style={{ cursor: 'default' }}>
              Lahore, Pakistan — Available Worldwide
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap fade-in fade-in--d2">
          <div className="contact-form-box">
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit} aria-label="Contact Form">
              {/* Hidden honeypot anti-spam field */}
              <input type="text" name="botcheck" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" aria-hidden="true" />
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    id="name" type="text" name="name" required
                    placeholder="Enter your name" className="form-input"
                    aria-required="true" aria-label="Name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    id="email" type="email" name="email" required
                    placeholder="Enter your email" className="form-input"
                    aria-required="true" aria-label="Email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  id="message" name="message" rows="4" required
                  placeholder="What's on your mind?" className="form-textarea"
                  aria-required="true" aria-label="Message content"
                />
              </div>

              {status === 'success' && (
                <div className="form-feedback form-feedback--success" role="alert" aria-live="polite">
                  ✓ Message sent successfully!
                </div>
              )}
              {status && status !== 'success' && (
                <div className="form-feedback form-feedback--error" role="alert" aria-live="polite">
                  {status === 'error' ? 'Something went wrong. Please try again.' : status}
                </div>
              )}

              <div className="form-submit-wrap">
                <button type="submit" className="form-submit" disabled={sending} aria-label="Submit contact form">
                  <span>{sending ? 'Sending…' : 'Send Message'}</span>
                  <ArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
