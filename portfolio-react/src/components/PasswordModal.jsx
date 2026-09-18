import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

// Generate an Archimedean spiral SVG path
function spiralPath(cx, cy, turns, maxR, points) {
  let d = `M ${cx} ${cy}`
  for (let i = 1; i <= points; i++) {
    const t = i / points
    const angle = t * turns * Math.PI * 2
    const r = t * maxR
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return d
}

export default function PasswordModal({ onClose }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, scale: 0.92, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (input.trim().toLowerCase() === 'brainstormers') {
      setSuccess(true)
      setError(false)
      setErrorMsg('')
      sessionStorage.setItem('corridor-unlocked', 'true')

      // === SWIRL TRANSITION ===
      const overlay = document.createElement('div')
      overlay.className = 'swirl-overlay'
      overlay.style.opacity = '0'

      // Create spiral SVG
      const svgNS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('viewBox', '0 0 200 200')
      svg.style.width = '200vmax'
      svg.style.height = '200vmax'
      svg.style.position = 'absolute'

      const path = document.createElementNS(svgNS, 'path')
      const d = spiralPath(100, 100, 6, 95, 300)
      path.setAttribute('d', d)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', '#222')
      path.setAttribute('stroke-width', '1.2')
      path.setAttribute('stroke-linecap', 'round')

      const pathLen = 4500 // approximate
      path.style.strokeDasharray = pathLen
      path.style.strokeDashoffset = pathLen

      svg.appendChild(path)
      overlay.appendChild(svg)
      document.body.appendChild(overlay)

      const tl = gsap.timeline()

      // 1. Fade in overlay + draw spiral outward
      tl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: 'power1.inOut'
      }, '<')

      // 2. Spin + scale outgoing content toward center
      tl.to(document.querySelector('.app-content') || document.body, {
        scale: 0,
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 0.7,
        ease: 'power2.in',
      }, '<0.1')

      // 3. Hold
      tl.to({}, { duration: 0.15 })

      // 4. Navigate, then reverse spiral
      tl.call(() => {
        onClose()
        navigate('/secret-corridor')
      })

      tl.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          overlay.remove()
          // Reset any transforms applied to app-content
          const appContent = document.querySelector('.app-content')
          if (appContent) {
            gsap.set(appContent, { scale: 1, rotation: 0 })
          }
        }
      })

    } else {
      setError(true)
      setErrorMsg('Wrong password. Try again.')
      setInput('')

      // Shake animation
      if (cardRef.current) {
        cardRef.current.classList.remove('ee-pw-error-input')
        void cardRef.current.offsetWidth // force reflow
      }

      gsap.fromTo(cardRef.current,
        { x: -8 },
        {
          x: 8, yoyo: true, repeat: 5, duration: 0.06,
          onComplete: () => gsap.set(cardRef.current, { x: 0 })
        }
      )

      setTimeout(() => {
        setError(false)
        setErrorMsg('')
      }, 3000)
    }
  }

  return (
    <div className="ee-password-overlay" onClick={onClose}>
      <div
        className="ee-password-card"
        ref={cardRef}
        onClick={e => e.stopPropagation()}
      >
        {!success ? (
          <form onSubmit={handleSubmit}>
            <h3>Secret Door</h3>
            <p className="ee-pw-hint">
              The password is the group that made me in uni.
            </p>
            <input
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              className={error ? 'ee-pw-error-input' : ''}
            />
            {errorMsg ? (
              <div className="ee-pw-error-msg">{errorMsg}</div>
            ) : (
              <div className="ee-pw-spacer" />
            )}
            <div style={{ marginTop: '0.8rem' }}>
              <button type="submit">Unlock</button>
            </div>
          </form>
        ) : (
          <div style={{ padding: '1.5rem 0' }}>
            <div style={{
              fontSize: '1.8rem',
              marginBottom: '0.5rem',
              fontFamily: "var(--font, 'Montserrat', sans-serif)",
              fontWeight: 400,
              color: '#ffffff'
            }}>
              You were right
            </div>
            <p style={{
              fontFamily: "var(--font, 'Montserrat', sans-serif)",
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              Welcome, dear friend...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
