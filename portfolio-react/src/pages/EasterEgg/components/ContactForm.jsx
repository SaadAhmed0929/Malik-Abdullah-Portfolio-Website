import { useState } from 'react'

export default function ContactForm({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Styled UI only — no actual email sending for now
    setSent(true)
    setTimeout(() => onClose(), 2000)
  }

  return (
    <div className="ee-contact-overlay" onClick={onClose}>
      <div className="ee-contact-letter" onClick={e => e.stopPropagation()}>
        <button className="ee-contact-close" onClick={onClose}>×</button>

        <div className="ee-contact-header">
          <span className="ee-contact-header__icon">✉️</span>
          <h3>Send a Letter</h3>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="ee-contact-field">
              <label>Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Write your name..."
                required
              />
            </div>
            <div className="ee-contact-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="ee-contact-field">
              <label>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="What's on your mind..."
                required
              />
            </div>
            <button type="submit" className="ee-contact-send">
              Send ✈
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📬</div>
            <p style={{
              fontFamily: 'var(--ee-font-hand)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--ee-ink)'
            }}>
              Letter sent!
            </p>
            <p style={{
              fontFamily: 'var(--ee-font-body)',
              fontSize: '0.82rem',
              color: 'var(--ee-ink-light)',
              marginTop: '0.4rem'
            }}>
              I'll get back to you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
